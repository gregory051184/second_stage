CREATE TABLE IF NOT EXISTS profession(
profession_id SERIAL PRIMARY KEY,
title VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS age_restriction(
age_restriction_id SERIAL PRIMARY KEY,
title VARCHAR(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS mpaa_rating(
mpaa_rating_id SERIAL PRIMARY KEY,
title VARCHAR(6) NOT NULL,
description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS translation(
translation_id SERIAL PRIMARY KEY,
title VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS subtitles(
subtitles_id SERIAL PRIMARY KEY,
title VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS video_quality(
video_quality_id SERIAL PRIMARY KEY,
title VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS film(
film_id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
eng_title TEXT NOT NULL,
film_description TEXT NOT NULL,
year_of_production VARCHAR(150) NOT NULL,
slogan TEXT NOT NULL,
budget INTEGER NOT NULL,
marketing INTEGER NOT NULL,
usa_fees INTEGER NOT NULL,
other_world_fees INTEGER NOT NULL,
premiere_in_russia TIMESTAMP,
premiere_in_world TIMESTAMP NOT NULL,
release_on_dvd DATE,
fk_age_restrictions INTEGER REFERENCES age_restriction(age_restriction_id) NOT NULL,
fk_mpaa_rating INTEGER REFERENCES mpaa_rating(mpaa_rating_id) NOT NULL,
duration INTEGER NOT NULL,
translations INTEGER REFERENCES translation(translation_id) NOT NULL,
fk_subtitles INTEGER REFERENCES subtitles(subtitles_id) NOT NULL,
fk_video_quality INTEGER REFERENCES video_quality(video_quality_id) NOT NULL,
image TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS person(
person_id SERIAL PRIMARY KEY,
first_name VARCHAR(100) NOT NULL,
second_name VARCHAR(150) NOT NULL,
height FLOAT NOT NULL,
date_of_birth DATE NOT NULL,
place_of_birth VARCHAR(250) NOT NULL,
spouse VARCHAR(250) NOT NULL,
all_films_count INTEGER NOT NULL,
best_films INTEGER DEFAULT 0,
best_serials INTEGER DEFAULT 0,
image TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS genre(
genre_id SERIAL PRIMARY KEY,
title VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS country(
country_id SERIAL PRIMARY KEY,
title VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS film_rating(
film_rating_id SERIAL PRIMARY KEY,
fk_film INTEGER REFERENCES film(film_id),
positive INTEGER DEFAULT 0,
negative INTEGER DEFAULT 0,
rating FLOAT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS film_person(
film_id INTEGER REFERENCES film(film_id),
person_id INTEGER REFERENCES person(person_id),
CONSTRAINT film_person_pk PRIMARY KEY (film_id, person_id)
);

CREATE TABLE IF NOT EXISTS film_genre(
film_id INTEGER REFERENCES film(film_id),
genre_id INTEGER REFERENCES genre(genre_id),
CONSTRAINT film_genre_pk PRIMARY KEY (film_id, genre_id)
);

CREATE TABLE IF NOT EXISTS person_genre(
person_id INTEGER REFERENCES person(person_id),
genre_id INTEGER REFERENCES genre(genre_id),
CONSTRAINT person_genre_pk PRIMARY KEY (person_id, genre_id)
);

CREATE TABLE IF NOT EXISTS person_profession(
person_id INTEGER REFERENCES person(person_id),
profession_id INTEGER REFERENCES profession(profession_id),
CONSTRAINT person_profession_pk PRIMARY KEY (person_id, profession_id)
);

CREATE TABLE IF NOT EXISTS person_profession(
person_id INTEGER REFERENCES person(person_id),
profession_id INTEGER REFERENCES profession(profession_id),
CONSTRAINT person_profession_pk PRIMARY KEY (person_id, profession_id)
);

CREATE TABLE IF NOT EXISTS film_country(
film_id INTEGER REFERENCES film(film_id),
country_id INTEGER REFERENCES country(country_id),
viewers INTEGER NOT NULL,
CONSTRAINT film_country_pk PRIMARY KEY (film_id, country_id)
);
