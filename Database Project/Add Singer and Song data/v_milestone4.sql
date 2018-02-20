
create view v_productive_song_writers as
  select pb.primary_name, count(*) as "Number of Films"
  from person_basics pb join singer_songs ss on pb.person_id = ss.person_id
  join title_songs ts on ss.song_id = ts.song_id
  join title_basics tb on ts.title_id = tb.title_id
  group by pb.primary_name
  having count(*) >= 100
  order by count(*) desc;


create view v_most_used_songs as
  select s.song_title, count(*) as "Number of Films"
  from songs s join title_songs ts on s.song_id = ts.song_id
  join title_basics tb on ts.title_id = tb.title_id
  group by s.song_title
  having count(*) > 3
  order by count(*) desc;
