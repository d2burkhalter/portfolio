create view v_title_financials as
  select tb.start_year, avg(tf.box_office)
  from title_basics tb join title_financials tf on tb.title_id = tf.title_id
  where tb.start_year > 1990 and tb.start_year < 2018 and tf.box_office > 1
  group by tb.start_year;
