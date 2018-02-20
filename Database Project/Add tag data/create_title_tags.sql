\c imdb;

create table Title_Tags (
	title_id char(10),
	tag varchar(300),
  primary key (title_id,tag)
);
