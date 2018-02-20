import psycopg2
import sys, os, configparser, csv
from pyspark import SparkConf, SparkContext

log_path = "/home/hadoop/logs/" # don't change this
aws_region = "us-east-1"  # don't change this
s3_bucket = "cs327e-fall2017-final-project" # don't change this
# files for milestone 4
persons_file = "s3a://" + s3_bucket + "/cinemalytics/persons.csv"
singer_songs_file = "s3a://" + s3_bucket + "/cinemalytics/singer_songs.csv"
songs_file = "s3a://" + s3_bucket + "/cinemalytics/songs.csv"
title_songs_file = "s3a://" + s3_bucket + "/cinemalytics/title_songs.csv"
titles_file = "s3a://" + s3_bucket + "/cinemalytics/titles.csv"

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
#removed counter to check full records
def print_rdd(rdd, logfile):
  f = open(log_path + logfile, "w")
  results = rdd.collect()
  for result in results:
    f.write(str(result) + "\n")
  f.close()

################## process the-numbers dataset #################################
import re

def parse_persons_line(line):
    #uses regular expression to split by commas and ignore those bewteen quotes
    fields = re.compile(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)").split(line)

    person_id = fields[0]
    primary_name = fields[1]
    gender = fields[2]
    dob = fields[3]
    if (dob != ''):
        dob = int(dob[:4])
    else:
        dob = -1

    person_data = [primary_name,gender,dob]

    return (person_id,person_data)

def parse_singer_songs_line(line):
    fields = re.compile(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)").split(line)

    person_id = fields[0]
    song_id = fields[1]

    return (person_id,song_id)

def parse_songs_line(line):
    fields = re.compile(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)").split(line)

    song_id = fields[0]
    song_title = fields[1]
    song_duration = fields[2]
    if (song_duration != ''):
        song_duration = float(song_duration)
    else:
        song_duration = -1

    song_data=[song_title,song_duration]

    return (song_id,song_data)

def parse_title_songs_line(line):
    fields = re.compile(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)").split(line)

    song_id = fields[0]
    movie_id = fields[1]

    return (movie_id,song_id)

def parse_titles_line(line):
    fields = re.compile(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)").split(line)

    movie_id = fields[0]
    imdb_id = fields[1]
    primary_title = fields[2]
    original_title = fields[3]
    genre = fields[4]
    release_year = fields[5]
    if (release_year != ''):
        release_year = int(release_year)
    else:
        release_year = -1

    titles_data=[imdb_id,primary_title,original_title,genre,release_year]

    return (movie_id,titles_data)

init()
#load files into RDDs
base_persons_rdd = sc.textFile(persons_file)
mapped_persons_rdd = base_persons_rdd.map(parse_persons_line)
print_rdd(mapped_persons_rdd, "mapped_persons_rdd")

base_singer_songs_rdd = sc.textFile(singer_songs_file)
mapped_singer_songs_rdd = base_singer_songs_rdd.map(parse_singer_songs_line)
print_rdd(mapped_singer_songs_rdd, "mapped_singer_songs_rdd")

base_songs_rdd = sc.textFile(songs_file)
mapped_songs_rdd = base_songs_rdd.map(parse_songs_line)
print_rdd(mapped_songs_rdd, "mapped_songs_rdd")

base_title_songs_rdd = sc.textFile(title_songs_file)
mapped_title_songs_rdd = base_title_songs_rdd.map(parse_title_songs_line)
print_rdd(mapped_title_songs_rdd, "mapped_title_songs_rdd")

base_titles_rdd = sc.textFile(titles_file)
mapped_titles_rdd = base_titles_rdd.map(parse_titles_line)
print_rdd(mapped_titles_rdd, "mapped_titles_rdd")

#insert songs into songs table
def save_songs(list_of_tuples):
    conn = psycopg2.connect(database=rds_database, user=rds_user, password=rds_password, host=rds_host, port=rds_port)
    conn.autocommit = True
    cur = conn.cursor()

    for tupl in list_of_tuples:

        song_id, song_data = tupl
        title = song_data[0]
        duration = song_data[1]

        insert_stmt = "INSERT INTO Songs (song_id, song_title, song_duration) VALUES (%s,%s,%s)"

        try:
            cur.execute(insert_stmt, (song_id,title,duration))
        except Exception as e:
            print "Error in save_songs: ", e.message

mapped_songs_rdd.foreachPartition(save_songs)

#insert into singer_songs table
def parse_singer_songs_persons_joined(line):
    return (line[0],line[1][1])

def save_singer_songs(list_of_tuples):
    conn = psycopg2.connect(database=rds_database, user=rds_user, password=rds_password, host=rds_host, port=rds_port)
    conn.autocommit = True
    cur = conn.cursor()

    for tupl in list_of_tuples:

        person_id, song_id = tupl

        insert_stmt = "INSERT INTO Singer_Songs (person_id, song_id) VALUES (%s,%s)"

        try:
            cur.execute(insert_stmt, (person_id,song_id))
        except Exception as e:
            print "Error in save_singer_song: ", e.message

#joins songs that have singers
rdd_persons_singer_songs_joined = mapped_persons_rdd.join(mapped_singer_songs_rdd)
#parses line returning only the person_id and song_id
final_singer_songs = rdd_persons_singer_songs_joined.map(parse_singer_songs_persons_joined)
print_rdd(final_singer_songs,"final_singer_songs")

final_singer_songs.foreachPartition(save_singer_songs)

#insert into person_basics table

def save_persons(list_of_tuples):
    conn = psycopg2.connect(database=rds_database, user=rds_user, password=rds_password, host=rds_host, port=rds_port)
    conn.autocommit = True
    cur = conn.cursor()

    for tupl in list_of_tuples:

        person_id, person_data = tupl
        name = person_data[1][0]
        birth = person_data[1][2]
        if (birth == -1):
            birth = None
        death = None
        gender = person_data[1][1]

        insert_stmt = "INSERT INTO Person_Basics (person_id, primary_name, birth_year, death_year, gender) VALUES (%s,%s,%s,%s,%s)"

        try:
            cur.execute(insert_stmt, (person_id,name,birth,death,gender))
        except Exception as e:
            print "Error in save_persons: ", e.message, person_data

#joins people who have songs
singer_people = mapped_singer_songs_rdd.join(mapped_persons_rdd)
#returns only one instance of people who have songs
distinct_singer_people = singer_people.reduceByKey(lambda a, b: a)
print_rdd(distinct_singer_people,"distinct_singer_people")

distinct_singer_people.foreachPartition(save_persons)

#insert into title_songs table
def save_title_songs(list_of_tuples):
    conn = psycopg2.connect(database=rds_database, user=rds_user, password=rds_password, host=rds_host, port=rds_port)
    conn.autocommit = True
    cur = conn.cursor()

    for tupl in list_of_tuples:

        movie_id, movie_data = tupl
        title_id = movie_data[1][0]
        song_id = movie_data[0]
        #inserts only if there is a title in our imdb database that the title_songs title_id refers to
        insert_stmt = "INSERT INTO Title_Songs (title_id, song_id) SELECT %s,%s WHERE EXISTS (SELECT * FROM Title_Basics tb WHERE tb.title_id = %s)"

        try:
            cur.execute(insert_stmt, (title_id,song_id,title_id))
        except Exception as e:
            print "Error in save_title_songs: ", e.message

#joins title_songs and titles because we need the imdb_id from titles
rdd_title_songs_titles_joined=mapped_title_songs_rdd.join(mapped_titles_rdd)

#removes all title_songs that have no imdb_id
final_title_songs = rdd_title_songs_titles_joined.filter(lambda a: a[1][1][0] != '')
print_rdd(final_title_songs,"final_title_songs")

final_title_songs.foreachPartition(save_title_songs)

# free up resources
sc.stop()
