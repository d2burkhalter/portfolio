create view v_title_tags as
  select upper(tg.tag), count(tg.tag), avg(tr.average_rating)
  from title_basics tb
  join title_tags tg on tb.title_id = tg.title_id
  join title_ratings tr on tb.title_id = tr.title_id
  where tb.title_type = 'movie' and upper(tg.tag) in ('G','PG','PG-13','R')
  group by upper(tg.tag);
