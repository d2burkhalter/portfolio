\c imdb;

create table Songs (
	song_id char(10),
	song_title varchar(300),
  song_duration float,
  primary key (song_id)
);

create table Title_Songs(
  title_id char(10),
  song_id char(10),
  primary key (title_id,song_id)
);

create table Singer_Songs(
  person_id char(10),
  song_id char(10),
  primary key (person_id,song_id)
);
