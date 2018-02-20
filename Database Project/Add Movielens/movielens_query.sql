\COPY (select * from title_ratings where movielens_rating is not null order by movielens_rating desc limit 20) TO 'C:/Users/David Burkhalter/Desktop/Database/elmdatabase/final-project/querytime.out';
