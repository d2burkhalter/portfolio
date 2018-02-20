create index base_query_idx on title_basics (start_year, UPPER(primary_title));

create index noTV_idx on title_basics (start_year, UPPER(primary_title),title_type);

/*did not use was worse than noTV_idx*/
create index noTV2_idx on title_basics (start_year, UPPER(primary_title)) where not (title_type='tvEpisode');
/*was not used by database since it is the same as the primary key index*/
create index genre_search_idx on title_genres (title_id,genre);
