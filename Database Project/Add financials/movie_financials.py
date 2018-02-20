import psycopg2
import sys, os, configparser, csv
from pyspark import SparkConf, SparkContext

log_path = "/home/hadoop/logs/" # don't change this
aws_region = "us-east-1"  # don't change this
s3_bucket = "cs327e-fall2017-final-project" # don't change this
the_numbers_files = "s3a://" + s3_bucket + "/the-numbers/*" # dataset for milestone 3

# global variable sc = Spark Context
sc = SparkContext()

# global variables for RDS connection
rds_config = configparser.ConfigParser()
rds_config.read(os.path.expanduser("~/config"))
rds_database = rds_config.get("default", "database")
rds_user = rds_config.get("default", "user")
rds_password = rds_config.get("default", "password")
rds_host = rds_config.get("default", "host")
rds_port = rds_config.get("default", "port")

def init():
    # set AWS access key and secret account key
    cred_config = configparser.ConfigParser()
    cred_config.read(os.path.expanduser("~/.aws/credentials"))
    access_id = cred_config.get("default", "aws_access_key_id")
    access_key = cred_config.get("default", "aws_secret_access_key")

    # spark and hadoop configuration
    sc.setSystemProperty("com.amazonaws.services.s3.enableV4", "true")
    hadoop_conf=sc._jsc.hadoopConfiguration()
    hadoop_conf.set("fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
    hadoop_conf.set("com.amazonaws.services.s3.enableV4", "true")
    hadoop_conf.set("fs.s3a.access.key", access_id)
    hadoop_conf.set("fs.s3a.secret.key", access_key)
    os.environ['PYSPARK_SUBMIT_ARGS'] = "--packages=org.apache.hadoop:hadoop-aws:2.7.3 pyspark-shell"

################## general utility function ##################################

def print_rdd(rdd, logfile):
  f = open(log_path + logfile, "w")
  results = rdd.collect()
  counter = 0
  for result in results:
    counter = counter + 1
    f.write(str(result) + "\n")
    if counter > 30:
      break
  f.close()

################## process the-numbers dataset #################################
import re
def parse_line(line):

    fields = line.split("\t")

    release_year = fields[0]
    release_year = release_year.split("/")
    release_year = release_year[2]

    movie_title = fields[1]
    movie_title = movie_title.strip()
    movie_title = movie_title.upper()
    movie_title = movie_title.encode('utf-8')

    genre = fields[2]
    genre = genre.strip()
    if (genre == 'Thriller/Suspense'):
        genre = "Thriller"
    if (genre == "Black Comedy"):
        genre = "Comedy"
    if (genre == "Romantic Comedy"):
        genre = "Romance"

    budget = fields[3]
    budget = budget.strip()
    budget = re.sub("\D", "" ,budget)
    if (budget == ""):
        budget = -1
    budget = int(budget)

    box_office = fields[4]
    box_office = box_office.strip()
    box_office = re.sub("\D", "" ,box_office)
    if (box_office == ""):
        box_office = -1
    box_office = int(box_office)

    return (release_year, movie_title, genre, budget, box_office)

init()
base_rdd = sc.textFile(the_numbers_files)
mapped_rdd = base_rdd.map(parse_line)
print_rdd(mapped_rdd, "mapped_rdd")

def insert_financials(cursor,title_id,budget,box_office):

    insert_stmt = "INSERT INTO Title_Financials (title_id,budget,box_office) VALUES (%s,%s,%s)"
    #print(title_id[0])
    cleanTitle = title_id[0][0].strip()
    try:
        cursor.execute(insert_stmt,(cleanTitle,budget,box_office))
    except Exception as e:
        print "Error in single insert: ", e.message

def noTV_search(cursor,year,title):

    noTV_query="SELECT title_id FROM title_basics tb WHERE tb.start_year = %s AND UPPER(tb.primary_title) = %s AND tb.title_type != 'tvEpisode'"

    try:
        cursor.execute(noTV_query,(year,title))
    except Exception as e:
        print "Error to complete noTV query: ", e.message

    return cursor.fetchall()

def genre_search(cursor,year,title,genre):

    genre_query="SELECT tb.title_id FROM title_basics tb JOIN title_genres tg ON tb.title_id = tg.title_id WHERE tb.start_year = %s AND UPPER(tb.primary_title) = %s AND tg.genre = %s"

    try:
        cursor.execute(genre_query,(year,title,genre))
    except Exception as e:
        print "Error to complete genre query: ", e.message

    return cursor.fetchall()


def save_to_db(list_of_tuples):

    conn = psycopg2.connect(database=rds_database, user=rds_user, password=rds_password, host=rds_host, port=rds_port)
    conn.autocommit = True
    cur = conn.cursor()

    for tupl in list_of_tuples:

        release_year, movie_title, genre, budget, box_office = tupl

        base_query = "SELECT title_id FROM title_basics tb WHERE tb.start_year = %s AND UPPER(tb.primary_title) = %s"

        try:
            cur.execute(base_query,(release_year,movie_title))
        except Exception as e:
            print "Error to complete base query: ", e.message

        rows = cur.fetchall()

        if (len(rows) == 0):
            continue
        if (len(rows) == 1):
            insert_financials(cur,rows,budget,box_office)
        if (len(rows) > 1):
            if (box_office > 1):
                no_bo = noTV_search(cur,release_year,movie_title)
                if (len(no_bo) == 1):
                    insert_financials(cur,no_bo,budget,box_office)
                else:
                    print("No tv match found"+str(len(no_bo)))
            if (box_office < 1):
                ge_search = genre_search(cur,release_year,movie_title,genre)
                if(len(ge_search) == 1):
                    insert_financials(cur,ge_search,budget,box_office)
                else:
                    print("No genre match found"+ str(len(ge_search)))

    # add logic to look up the title_id in the database as specified in step 5 of assignment sheet
    # add logic to write out the financial record to the database as specified in step 5 of assignment sheet

    cur.close()
    conn.close()


mapped_rdd.foreachPartition(save_to_db)

# free up resources
sc.stop()
