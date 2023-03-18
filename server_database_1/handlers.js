import fs from "fs";
import path from "path";
import pool from "./films_db.js";
import {fileURLToPath} from 'url';


const db = pool;

const get_params = async (req, res, arg) => {
    const params_keys = Object.keys(req.params);
    if (Object.keys(req.params).length === 0) {
        arg = await db.query(`SELECT * FROM ${arg}`)
        res.send(arg.rows)
    } else if (params_keys.length > 1) {
        res.send("Слишком много параметров, я пока умею работать только с одним... Но я буду учиться")
    }
    return params_keys
}

//Главная страница с инструкциями
//________________________________________________________________________________________________________
export const main_page = async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const file = path.dirname(__filename) + '\\main_page.html'
    try {
        fs.readFile(file, (err, content) => {
            if (content) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(content);
                res.end();
            } else {
                res.writeHead(404);
                res.write('File not found');
                res.end()
            }
        })

    } catch {
        res.end("Не получилось загрузить главную страницу  :(")
    }
}

//Жанры
//________________________________________________________________________________________________________
export const get_genre = async (req, res) => {
    const params_keys = await get_params(req, res, 'genre');
    try {
        const genre = await db.query(`SELECT * FROM genre WHERE ${params_keys[0]} = $1`, [req.params[params_keys]])
        res.send(genre.rows)
    } catch {
        res.send("Не получилось")
    }
};

export const get_genre_by_film = async (req, res) => {
    const params_keys = await get_params(req, res, 'genre');
    try {
        const genre = await db.query(`SELECT film.name, genre.title
                                      FROM genre
                                      JOIN film_genre ON genre.genre_id = film_genre.genre_id
                                      JOIN film ON film.film_id = film_genre.film_id
                                      WHERE film.name = $1`, [req.params[params_keys]])
        res.send(genre.rows)
    } catch {
        res.send("Не получилось.")
    }
};

export const get_genre_by_person = async (req, res) => {
    const params_keys = await get_params(req, res, 'genre');
    try {
        const genre = await db.query(`SELECT person.first_name, person.second_name, genre.title
                                      FROM genre
                                      JOIN person_genre ON genre.genre_id = person_genre.genre_id
                                      JOIN person ON person.person_id = person_genre.person_id
                                      WHERE person.second_name = $1`, [req.params[params_keys]])
        res.send(genre.rows)
    } catch {
        res.send("Не получилось.")
    }
};

export const create_genre = async (req, res) => {
    const {title} = req.body;
    const genre = await db.query(`SELECT COUNT(*) FROM genre WHERE title = $1`, [title]);
    if(genre.rows[0]['count'] > 0){
        res.end('Такой жанр уже существует');
    }else {
        const new_genre = await db.query('INSERT INTO genre(title) VALUES ($1) RETURNING*', [title]);
        res.send(new_genre);
    }

};

export const update_genre = async (req, res) => {
    const {genre_id, title} = req.body;
    const new_genre = await db.query('UPDATE genre SET title = $2 WHERE genre_id = $1 RETURNING*', [genre_id, title]);
    res.send(new_genre);
};

export const delete_genre = async (req, res) => {
    const genre_id = req.params['genre_id'];
    const new_genre = await db.query('DELETE FROM genre WHERE genre_id = $1 RETURNING*', [genre_id]);
    res.send(new_genre);
};


//Личности
//________________________________________________________________________________________________________
export const get_person = async (req, res) => {
    const params_keys = await get_params(req, res, 'person');
    try {
        const person = await db.query(`SELECT * FROM person WHERE ${params_keys[0]} = $1`, [req.params[params_keys]]);
        res.send(person.rows);
    } catch {
        res.send("Не получилось");
    }
};

export const get_person_by_profession = async (req, res) => {
    const params_keys = Object.keys(req.params);
    if (Object.keys(req.params).length === 0) {
        const arg = await db.query(`SELECT * FROM person`);
        res.send(arg.rows);
    } else if (params_keys.length > 2) {
        res.send("Слишком много параметров, я пока умею работать только с двумя... Но я буду учиться");
    } else if (!req.params['second_name'] && !req.params['title']) {
        res.send("Неправильные параметры, должны быть ?second_name=Фамилия Актёра и ?title=Профессия");
    } else if (req.params['second_name'] && req.params['title']) {
        try {
            const profession = await db.query(`SELECT DISTINCT person.first_name, person.second_name, profession.title
                                     FROM film
                                     JOIN film_person ON film.film_id = film_person.film_id
                                     JOIN person ON person.person_id = film_person.person_id
                                     JOIN person_profession ON person_profession.person_id = person.person_id
                                     JOIN profession ON profession.profession_id = person_profession.profession_id
                                     WHERE person.second_name = $1 AND profession.title = $2
                                     ORDER BY film.name`, [req.params['second_name'], req.params['title']]);
            res.send(profession.rows);
        } catch {
            res.send("Не получилось");
        }
    } else if (req.params['second_name']) {
        try {
            const film = await db.query(`SELECT DISTINCT person.first_name, person.second_name, profession.title
                                     FROM person                                
                                     JOIN person_profession ON person_profession.person_id = person.person_id
                                     JOIN profession ON profession.profession_id = person_profession.profession_id
                                     WHERE person.second_name = $1
                                     ORDER BY person.second_name`, [req.params['second_name']]);
            res.send(film.rows);
        } catch {
            res.send("Не получилось");
        }
    }
};

export const get_person_by_film = async (req, res) => {
    const params_keys = await get_params(req, res, 'person');
    try {
        const person = await db.query(`SELECT person.first_name, person.second_name, film.name
                                      FROM person
                                      JOIN film_person ON person.person_id = film_person.person_id
                                      JOIN film ON film.film_id = film_person.film_id
                                      WHERE film.name = $1`, [req.params[params_keys[0]]]);
        res.send(person.rows);
    } catch {
        res.send("Не получилось");
    }
};

export const get_person_by_genre = async (req, res) => {
    const params_keys = await get_params(req, res, 'person');
    try {
        const person = await db.query(`SELECT person.first_name, person.second_name, genre.title
                                      FROM person
                                      JOIN person_genre ON person.person_id = person_genre.person_id
                                      JOIN genre ON genre.genre_id = person_genre.genre_id
                                      WHERE genre.title = $1`, [req.params[params_keys[0]]]);
        res.send(person.rows);
    } catch {
        res.send("Не получилось");
    }
};

export const create_person = async (req, res) => {
    const genres = req.body['genres'];
    const professions = req.body['professions'];
    const films = req.body['films'];
    const {
        first_name, second_name, height, date_of_birth, place_of_birth, spouse,
        all_films_count, best_films, best_serials, image
    } = req.body;
    const person = await db.query(`SELECT COUNT(*) FROM person WHERE second_name = $1 AND first_name = $2`,
        [second_name, first_name]);
    if(person.rows[0]['count'] > 0){
        res.end('Такой человек уже существует');
    }else {
        const new_person = await db.query('INSERT INTO person(first_name, second_name, height, date_of_birth,' +
            ' place_of_birth, spouse, all_films_count, best_films, best_serials, image) VALUES ($1, $2, $3, $4, $5, $6, $7,' +
            ' $8, $9, $10) RETURNING*', [first_name, second_name, height, date_of_birth, place_of_birth, spouse,
            all_films_count, best_films, best_serials, image]);
        try {
            if (genres && genres.length > 0) {
                await db.query(`SELECT person_id FROM person WHERE second_name = $1 AND first_name = $2`,
                    [second_name, first_name]).then(data => {
                    genres.forEach(g => {
                        db.query(`INSERT INTO person_genre VALUES ($1, $2)`, [data.rows[0]['person_id'].toString(),
                            g.toString()])
                    })
                })
            } else if (films && films.length > 0) {
                await db.query(`SELECT person_id FROM person WHERE second_name = $1 AND first_name = $2`,
                    [second_name, first_name]).then(data => {
                    films.forEach(film => {
                        db.query(`INSERT INTO film_person VALUES ($1, $2)`, [film.toString(),
                            data.rows[0]['person_id'].toString()])
                    })
                })
            }
            if (professions && professions.length > 0) {
                await db.query(`SELECT person_id FROM person WHERE second_name = $1 AND first_name = $2`,
                    [second_name, first_name]).then(data => {
                    professions.forEach(prof => {
                        db.query(`INSERT INTO person_professions VALUES ($1, $2)`, [data.rows[0]['person_id'].toString(),
                            prof.toString()])
                    })
                })
            }
        } catch {
            res.send('Что-то пошло не так')
        }
        res.send(new_person);
    }
};

export const update_person = async (req, res) => {
    const {
        person_id, first_name, second_name, height, date_of_birth, place_of_birth, spouse,
        all_films_count, best_films, best_serials, image
    } = req.body;
    const person = await db.query('UPDATE person SET first_name = $2, second_name = $3, height = $4,' +
        ' date_of_birth = $5, place_of_birth = $6, spouse = $7, all_films_count = $8,' +
        ' best_films = $9, best_serials = $10, image = $11 WHERE person_id = $1 RETURNING*', [person_id, first_name,
        second_name, height, date_of_birth, place_of_birth, spouse, all_films_count, best_films, best_serials, image]);
    res.send(person);
};

export const delete_person = async (req, res) => {
    const person_id = req.params['person_id'];
    const person = await db.query('DELETE FROM person WHERE person_id = $1', [person_id]);
    res.send(person);
};

// Фильмы
//________________________________________________________________________________________________________
export const get_film = async (req, res) => {
    const params_keys = await get_params(req, res, 'film');
    try {
        const film = await db.query(`SELECT * FROM film WHERE ${params_keys[0]} = $1`, [req.params[params_keys]]);
        res.send(film.rows);
    } catch {
        res.send("Не получилось");
    }
};

export const get_film_by_genre = async (req, res) => {
    const params_keys = await get_params(req, res, 'film');
    try {
        const genre = await db.query(`SELECT film.name, genre.title 
                                      FROM film
                                      JOIN film_genre ON film.film_id = film_genre.film_id
                                      JOIN genre ON genre.genre_id = film_genre.genre_id
                                      WHERE genre.title = $1`, [req.params[params_keys[0]]]);
        res.send(genre.rows);
    } catch {
        res.send("Не получилось");
    }
};


export const get_film_by_country = async (req, res) => {
    const params_keys = await get_params(req, res, 'film');
    try {
        const film = await db.query(`SELECT film.name, country.title, country.fees
                              FROM film
                              JOIN country ON film.film_id = country.fk_film
                              WHERE country.title = $1`, [req.params[params_keys[0]]])
        res.send(film.rows);
    } catch {
        res.send("Не получилось");
    }
};

export const get_film_by_person_and_prof = async (req, res) => {
    const params_keys = Object.keys(req.params);
    if (Object.keys(req.params).length === 0) {
        const arg = await db.query(`SELECT * FROM film`);
        res.send(arg.rows);
    } else if (params_keys.length > 2) {
        res.send("Слишком много параметров, я пока умею работать только с двумя... Но я буду учиться");
    } else if (!req.params['second_name'] && !req.params['title'] && !req.params['name']) {
        res.send("Неправильные параметры, должны быть ?second_name=Фамилия Актёра и ?title=Профессия или ?name=Название фильма");
    } else if (req.params['second_name'] && req.params['title']) {
        try {
            const film = await db.query(`SELECT DISTINCT person.first_name, person.second_name, film.name, profession.title
                                     FROM film
                                     JOIN film_person ON film.film_id = film_person.film_id
                                     JOIN person ON person.person_id = film_person.person_id
                                     JOIN person_profession ON person_profession.person_id = person.person_id
                                     JOIN profession ON profession.profession_id = person_profession.profession_id
                                     WHERE person.second_name = $1 AND profession.title = $2
                                     ORDER BY film.name`, [req.params['second_name'],
                req.params['title']]);
            res.send(film.rows);
        } catch {
            res.send("Не получилось");
        }
    } else if (req.params['second_name']) {
        try {
            const film = await db.query(`SELECT DISTINCT person.first_name, person.second_name, film.name, profession.title
                                               FROM film
                                               JOIN film_person ON film.film_id = film_person.film_id
                                               JOIN person ON person.person_id = film_person.person_id
                                               JOIN person_profession ON person_profession.person_id = person.person_id
                                               JOIN profession ON profession.profession_id = person_profession.profession_id
                                               WHERE person.second_name = $1
                                               ORDER BY film.name`, [req.params['second_name']]);
            res.send(film.rows);
        } catch {
            res.send("Не получилось");
        }
    } else if (req.params['title']) {
        try {
            const film = await db.query(`SELECT DISTINCT person.first_name, person.second_name, film.name, profession.title
                                     FROM film
                                     JOIN film_person ON film.film_id = film_person.film_id
                                     JOIN person ON person.person_id = film_person.person_id
                                     JOIN person_profession ON person_profession.person_id = person.person_id
                                     JOIN profession ON profession.profession_id = person_profession.profession_id
                                     WHERE film.name = $1 AND profession.title = $2
                                     ORDER BY film.name`, [req.params['name'], req.params['title']]);
            res.send(film.rows);
        } catch {
            res.send("Не получилось");
        }
    }
};

export const create_film = async (req, res) => {
    const genres = req.body['genres'];
    const persons = req.body['persons'];
    const countries = req.body['countries'];
    const {
        name, eng_title, production_country, film_description, year_of_production, slogan, budget, marketing,
        usa_fees, other_world_fees, premiere_in_russia, premiere_in_world, release_on_dvd,
        fk_age_restrictions, fk_mpaa_rating, duration, translations, fk_subtitles, fk_video_quality, image
    } = req.body;
    const film = await db.query(`SELECT COUNT(*) FROM film WHERE name = $1`, [name]);
    if(film.rows[0]['count'] > 0){
        res.end('Такой фильм уже существует');
    }else {
        const new_film = await db.query('INSERT INTO film(name, eng_title, production_country, film_description,' +
            ' year_of_production, slogan, budget, marketing, ' +
            ' usa_fees, other_world_fees, premiere_in_russia, premiere_in_world, release_on_dvd, ' +
            ' fk_age_restrictions, fk_mpaa_rating, duration, translations, fk_subtitles, fk_video_quality, image) ' +
            ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14, $15, $16, $17, $18, $19, $20) RETURNING*',
            [name, eng_title, production_country, film_description, year_of_production, slogan, budget, marketing,
                usa_fees, other_world_fees, premiere_in_russia, premiere_in_world, release_on_dvd,
                fk_age_restrictions, fk_mpaa_rating, duration, translations, fk_subtitles, fk_video_quality, image]);
        try {
            if (genres && genres.length > 0) {
                await db.query(`SELECT film_id FROM film WHERE name = $1 AND eng_title = $2`,
                    [name, eng_title]).then(data => {
                    genres.forEach(g => {
                        db.query(`INSERT INTO film_genre VALUES ($1, $2)`, [data.rows[0]['film_id'].toString(),
                            g.toString()])
                    })
                })
            } else if (persons && persons.length > 0) {
                await db.query(`SELECT film_id FROM film WHERE name = $1 AND eng_title = $2`,
                    [name, eng_title]).then(data => {
                    persons.forEach(person => {
                        db.query(`INSERT INTO film_person VALUES ($1, $2)`, [data.rows[0]['film_id'].toString(),
                            person.toString()])
                    })
                })
            }
            if (countries && countries.length > 0) {
                await db.query(`SELECT film_id FROM film WHERE name = $1 AND eng_title = $2`,
                    [name, eng_title]).then(data => {
                    countries.forEach(country => {
                        db.query(`INSERT INTO film_country VALUES ($1, $2, $3)`, [data.rows[0]['film_id'].toString(),
                            country[0].toString(), country[1].toString()])
                    })
                })
            }
        } catch {
            res.send('Что-то пошло не так');
        }
        res.send(new_film);
    }

};

export const update_film = async (req, res) => {
    const {
        film_id, name, eng_title, production_country, film_description, year_of_production, slogan, budget, marketing,
        usa_fees, other_world_fees, premiere_in_russia, premiere_in_world, release_on_dvd,
        fk_age_restrictions, fk_mpaa_rating, duration, translations, fk_subtitles, fk_video_quality, image
    } = req.body;
    const new_film = await db.query('UPDATE film SET name = $2, eng_title = $3, production_country = $4, ' +
        ' film_description = $5,' +
        ' year_of_production = $6, slogan = $7, budget = $8, marketing = $9, usa_fees = $10, other_world_fees = $11,' +
        ' premiere_in_russia = $12, premiere_in_world = $13, release_on_dvd = $14,' +
        ' fk_age_restrictions = $15,' +
        ' fk_mpaa_rating = $16, duration = $17, translations = $18, fk_subtitles = $19, fk_video_quality = $20,' +
        ' image = $21 WHERE film_id = $1 RETURNING*', [film_id, name, eng_title, production_country, film_description,
        year_of_production, slogan, budget, marketing, usa_fees, other_world_fees, premiere_in_russia, premiere_in_world,
        release_on_dvd, fk_age_restrictions, fk_mpaa_rating, duration, translations, fk_subtitles,
        fk_video_quality, image]);
    res.send(new_film);
};

export const delete_film = async (req, res) => {
    const film_id = req.params['film_id'];
    const film = await db.query('DELETE FROM film WHERE film_id = $1', [film_id]);
    res.send(film);
};

// Страны
//________________________________________________________________________________________________________
export const get_country = async (req, res) => {
    const params_keys = await get_params(req, res, 'country');
    try {
        const country = await db.query(`SELECT * FROM country WHERE ${params_keys[0]} = $1`, [req.params[params_keys]])
        res.send(country.rows)
    } catch {
        res.send("Не получилось")
    }
};

export const get_country_by_film = async (req, res) => {
    const params_keys = await get_params(req, res, 'country');
    try {
        const country = await db.query(`SELECT film.name, country.title, film_country.viewers
                                        FROM film
                                        JOIN film_country ON film.film_id = film_country.film_id 
                                        JOIN country ON country.country_id = film_country.country_id
                                        WHERE film.name = $1`, [req.params[params_keys[0]]])
        res.send(country.rows);
    } catch {
        res.send("Не получилось");
    }
};

export const create_country = async (req, res) => {
    const {title} = req.body;
    const country = await db.query(`SELECT COUNT(*) FROM country WHERE title = $1`, [title]);
    if(country.rows[0]['count'] > 0){
        res.end('Такая страна уже существует');
    }else {
        const new_country = await db.query('INSERT INTO country(title) VALUES ($1) RETURNING*', [title]);
        res.send(new_country);
    }

};

export const update_country = async (req, res) => {
    const {country_id, title} = req.body;
    const new_country = await db.query('UPDATE country SET title = $2 WHERE' +
        ' country_id = $1 RETURNING*', [country_id, title]);
    res.send(new_country);
};

export const delete_country = async (req, res) => {
    const country_id = req.params['country_id'];
    const country = await db.query('DELETE FROM country WHERE country_id = $1 RETURNING*',
        [country_id]);
    res.send(country);
};

// Профессии profession
//________________________________________________________________________________________________________
export const get_profession = async (req, res) => {
    const params_keys = await get_params(req, res, 'profession');
    try {
        const profession = await db.query(`SELECT * FROM profession WHERE ${params_keys[0]} = $1`,
            [req.params[params_keys]])
        res.send(profession.rows)
    } catch {
        res.send("Не получилось")
    }
};

export const get_profession_by_film_and_person = async (req, res) => {
    const params_keys = Object.keys(req.params);
    if (Object.keys(req.params).length === 0) {
        const arg = await db.query(`SELECT * FROM profession`)
        res.send(arg.rows)
    } else if (params_keys.length > 2) {
        res.send("Слишком много параметров, я пока умею работать только с двумя... Но я буду учиться")
    } else if (!req.params['name'] && !req.params['title']) {
        res.send("Неправильные параметры, должны быть ?name=Название фильма и ?title=Профессия")
    } else if (req.params['name'] && req.params['title']) {
        try {
            const profession = await db.query(`SELECT DISTINCT person.first_name, person.second_name, film.name,
                                     profession.title
                                     FROM film
                                     JOIN film_person ON film.film_id = film_person.film_id
                                     JOIN person ON person.person_id = film_person.person_id
                                     JOIN person_profession ON person_profession.person_id = person.person_id
                                     JOIN profession ON profession.profession_id = person_profession.profession_id
                                     WHERE film.name = $1 AND profession.title = $2
                                     ORDER BY film.name`, [req.params['name'],
                req.params['title']]);
            res.send(profession.rows);
        } catch {
            res.send("Не получилось");
        }
    } else if (req.params['name']) {
        try {
            const profession = await db.query(`SELECT DISTINCT person.first_name, person.second_name, film.name,
                                     profession.title
                                     FROM film
                                     JOIN film_person ON film.film_id = film_person.film_id
                                     JOIN person ON person.person_id = film_person.person_id
                                     JOIN person_profession ON person_profession.person_id = person.person_id
                                     JOIN profession ON profession.profession_id = person_profession.profession_id
                                     WHERE film.name = $1
                                     ORDER BY film.name`, [req.params['name']]);
            res.send(profession.rows);
        } catch {
            res.send("Не получилось");
        }
    } else if (req.params['title']) {
        try {
            const profession = await db.query(`SELECT DISTINCT person.first_name, person.second_name, profession.title
                                     FROM person
                                     JOIN person_profession ON person_profession.person_id = person.person_id
                                     JOIN profession ON profession.profession_id = person_profession.profession_id
                                     WHERE profession.title = $1
                                     ORDER BY profession.title`, [req.params['title']]);
            res.send(profession.rows);
        } catch {
            res.send("Не получилось");
        }
    }
};

export const create_profession = async (req, res) => {
    const {title} = req.body;
    const profession = await db.query(`SELECT COUNT(*) FROM profession WHERE title = $1`, [title]);
    if(profession.rows[0]['count'] > 0){
        res.end('Такая профессия уже существует');
    }else {
        const new_profession = await db.query('INSERT INTO profession(title) VALUES ($1) RETURNING*', [title]);
        res.send(new_profession);
    }

};

export const update_profession = async (req, res) => {
    const {profession_id, title} = req.body;
    const new_profession = await db.query('UPDATE profession SET title = $2 WHERE' +
        ' profession_id = $1 RETURNING*', [profession_id, title]);
    res.send(new_profession);
};

export const delete_profession = async (req, res) => {
    const profession_id = req.params['profession_id'];
    const profession = await db.query('DELETE FROM profession WHERE profession_id = $1 RETURNING*',
        [profession_id]);
    res.send(profession);
};

// Субтитры subtitles
//________________________________________________________________________________________________________
export const get_subtitles = async (req, res) => {
    const params_keys = await get_params(req, res, 'subtitles');
    try {
        const subtitles = await db.query(`SELECT * FROM subtitles WHERE ${params_keys[0]} = $1`,
            [req.params[params_keys]])
        res.send(subtitles.rows)
    } catch {
        res.send("Не получилось")
    }
};

export const create_subtitles = async (req, res) => {
    const {title} = req.body;
    const subtitles = await db.query(`SELECT COUNT(*) FROM subtitles WHERE title = $1`, [title]);
    if(subtitles.rows[0]['count'] > 0){
        res.end('Такие субтитры уже существуют');
    }else {
        const new_subtitles = await db.query('INSERT INTO subtitles(title) VALUES ($1) RETURNING*', [title]);
        res.send(new_subtitles);
    }

};

export const update_subtitles = async (req, res) => {
    const {subtitles_id, title} = req.body;
    const new_subtitles = await db.query('UPDATE subtitles SET title = $2 WHERE' +
        ' subtitles_id = $1 RETURNING*', [subtitles_id, title]);
    res.send(new_subtitles);
};

export const delete_subtitles = async (req, res) => {
    const subtitles_id = req.params['subtitles_id'];
    const subtitles = await db.query('DELETE FROM subtitles WHERE subtitles_id = $1 RETURNING*',
        [subtitles_id]);
    res.send(subtitles);
};

// Перевод translation
//________________________________________________________________________________________________________
export const get_translation = async (req, res) => {
    const params_keys = await get_params(req, res, 'translation');
    try {
        const translation = await db.query(`SELECT * FROM translation WHERE ${params_keys[0]} = $1`,
            [req.params[params_keys]])
        res.send(translation.rows)
    } catch {
        res.send("Не получилось")
    }
};

export const create_translation = async (req, res) => {
    const {title} = req.body;
    const translation = await db.query(`SELECT COUNT(*) FROM translation WHERE title = $1`, [title]);
    if(translation.rows[0]['count'] > 0){
        res.end('Такой язык перевода уже существует');
    }else {
        const new_translation = await db.query('INSERT INTO translation(title) VALUES ($1) RETURNING*', [title]);
        res.send(new_translation);
    }

};

export const update_translation = async (req, res) => {
    const {translation_id, title} = req.body;
    const new_translation = await db.query('UPDATE translation SET title = $2 WHERE' +
        ' translation_id = $1 RETURNING*', [translation_id, title]);
    res.send(new_translation);
};

export const delete_translation = async (req, res) => {
    const translation_id = req.params['translation_id'];
    const translation = await db.query('DELETE FROM translation WHERE translation_id = $1 RETURNING*',
        [translation_id]);
    res.send(translation);
};

// Качество видео video_quality
//________________________________________________________________________________________________________
export const get_video_quality = async (req, res) => {
    const params_keys = await get_params(req, res, 'video_quality');
    try {
        const video_quality = await db.query(`SELECT * FROM video_quality WHERE ${params_keys[0]} = $1`,
            [req.params[params_keys]])
        res.send(video_quality.rows)
    } catch {
        res.send("Не получилось")
    }
};

export const create_video_quality = async (req, res) => {
    const {title} = req.body;
    const video_quality = await db.query(`SELECT COUNT(*) FROM video_quality WHERE title = $1`, [title]);
    if(video_quality.rows[0]['count'] > 0){
        res.end('Такое качество видео уже существует');
    }else {
        const new_video_quality = await db.query('INSERT INTO video_quality(title) VALUES ($1) RETURNING*', [title]);
        res.send(new_video_quality);
    }

};

export const update_video_quality = async (req, res) => {
    const {video_quality_id, title} = req.body;
    const new_video_quality = await db.query('UPDATE video_quality SET title = $2 WHERE' +
        ' video_quality_id = $1 RETURNING*', [video_quality_id, title]);
    res.send(new_video_quality);
};

export const delete_video_quality = async (req, res) => {
    const video_quality_id = req.params['video_quality_id'];
    const video_quality = await db.query('DELETE FROM video_quality WHERE video_quality_id = $1 RETURNING*',
        [video_quality_id]);
    res.send(video_quality);
};

// Таблица возрастных ограничений age_restriction
//________________________________________________________________________________________________________
export const get_age_restriction = async (req, res) => {
    const params_keys = await get_params(req, res, 'age_restriction');
    try {
        const age_restriction = await db.query(`SELECT * FROM age_restriction WHERE ${params_keys[0]} = $1`,
            [req.params[params_keys]])
        res.send(age_restriction.rows)
    } catch {
        res.send("Не получилось")
    }
};

export const create_age_restriction = async (req, res) => {
    const {title} = req.body;
    const age_restriction = await db.query(`SELECT COUNT(*) FROM age_restriction WHERE title = $1`, [title]);
    if(age_restriction.rows[0]['count'] > 0){
        res.end('Такое ограничение уже существует');
    }else {
        const new_age_restriction = await db.query('INSERT INTO age_restriction(title) VALUES ($1) RETURNING*', [title]);
        res.send(new_age_restriction);
    }

};

export const update_age_restriction = async (req, res) => {
    const {age_restriction_id, title} = req.body;
    const new_age_restriction = await db.query('UPDATE age_restriction SET title = $2 WHERE' +
        ' age_restriction_id = $1 RETURNING*', [age_restriction_id, title]);
    res.send(new_age_restriction);
};

export const delete_age_restriction = async (req, res) => {
    const age_restriction_id = req.params['age_restriction_id'];
    const age_restriction = await db.query('DELETE FROM age_restriction WHERE age_restriction_id = $1 RETURNING*',
        [age_restriction_id]);
    res.send(age_restriction);
};

// Таблица MPAA ограничений mpaa_rating
//________________________________________________________________________________________________________
export const get_mpaa_rating = async (req, res) => {
    const params_keys = await get_params(req, res, 'mpaa_rating');
    try {
        const mpaa_rating = await db.query(`SELECT * FROM mpaa_rating WHERE ${params_keys[0]} = $1`,
            [req.params[params_keys]])
        res.send(mpaa_rating.rows)
    } catch {
        res.send("Не получилось")
    }
};

export const create_mpaa_rating = async (req, res) => {
    const {title, description} = req.body;
    const mpaa_rating = await db.query(`SELECT COUNT(*) FROM mpaa_rating WHERE title = $1`, [title]);
    if(mpaa_rating.rows[0]['count'] > 0){
        res.end('Такое ограничение уже существует');
    }else {
        const new_mpaa_rating = await db.query('INSERT INTO mpaa_rating(title, description) VALUES ($1, $2)' +
            ' RETURNING*', [title, description]);
        res.send(new_mpaa_rating);
    }

};

export const update_mpaa_rating = async (req, res) => {
    const {mpaa_rating_id, title, description} = req.body;
    const new_mpaa_rating = await db.query('UPDATE mpaa_rating SET title = $2, description = $3 WHERE' +
        ' age_restriction_id = $1 RETURNING*', [mpaa_rating_id, title, description]);
    res.send(new_mpaa_rating);
};

export const delete_mpaa_rating = async (req, res) => {
    const mpaa_rating_id = req.params['mpaa_rating_id'];
    const mpaa_rating = await db.query('DELETE FROM mpaa_rating WHERE mpaa_rating_id = $1 RETURNING*',
        [mpaa_rating_id]);
    res.send(mpaa_rating);
};

//_____________________________________________________________________________________________________________________




//Заполнение таблицы film_country
//_____________________________________________________________________________________________________________________
export const create_film_country = async (req, res) => {
    const {film_id, country_id} = req.body;
    const new_film_country = await db.query('INSERT INTO film_country VALUES ($1, $2) RETURNING*', [film_id, country_id]);
    res.send(new_film_country);
};

//Заполнение таблицы film_genre
//_____________________________________________________________________________________________________________________
export const create_film_genre = async (req, res) => {
    const {film_id, genre_id} = req.body;
    const new_film_genre = await db.query('INSERT INTO film_genre VALUES ($1, $2) RETURNING*', [film_id, genre_id]);
    res.send(new_film_genre);
};

//Заполнение таблицы film_person
//_____________________________________________________________________________________________________________________
export const create_film_person = async (req, res) => {
    const {film_id, person_id} = req.body;
    const new_film_person = await db.query('INSERT INTO film_person VALUES ($1, $2) RETURNING*', [film_id, person_id]);
    res.send(new_film_person);
};

//Заполнение таблицы person_genre
//_____________________________________________________________________________________________________________________
export const create_person_genre = async (req, res) => {
    const {person_id, genre_id} = req.body;
    const new_person_genre = await db.query('INSERT INTO person_genre VALUES ($1, $2) RETURNING*',
        [person_id, genre_id]);
    res.send(new_person_genre);
};

//Заполнение таблицы person_profession
//_____________________________________________________________________________________________________________________
export const create_person_profession = async (req, res) => {
    const {person_id, profession_id} = req.body;
    const new_person_profession = await db.query('INSERT INTO person_profession VALUES ($1, $2) RETURNING*',
        [person_id, profession_id]);
    res.send(new_person_profession);
};



