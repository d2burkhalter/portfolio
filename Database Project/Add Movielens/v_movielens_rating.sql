create view v_movielens_rating as
  select tr.movielens_rating, count(*)
  from title_ratings tr join title_basics tb on tr.title_id=tb.title_id
  where tb.start_year = 2010 and tr.movielens_rating is not null
  group by tr.movielens_rating
  order by tr.movielens_rating;
