import {Router} from "./router.js";
import {Application} from "./application.js";
import {
    create_film,
    create_genre,
    create_person,
    delete_film,
    delete_genre,
    delete_person,
    get_film,
    get_film_by_genre,
    get_genre,
    get_person,
    get_person_by_profession,
    main_page,
    update_film,
    update_genre,
    update_person,
    get_person_by_film,
    get_country_by_film,
    get_film_by_country,
    get_profession_by_film_and_person,
    get_genre_by_film,
    get_genre_by_person,
    get_film_by_person_and_prof,
    get_person_by_genre,
    get_country,
    create_country,
    update_country,
    delete_country,
    create_film_country,
    create_film_genre,
    create_film_person,
    create_person_genre,
    create_person_profession,
    get_profession,
    create_profession,
    update_profession,
    delete_profession,
    get_subtitles,
    create_subtitles,
    update_subtitles,
    delete_subtitles,
    get_translation,
    create_translation,
    update_translation,
    delete_translation,
    get_video_quality,
    create_video_quality,
    update_video_quality,
    delete_video_quality,
    get_age_restriction,
    create_age_restriction,
    update_age_restriction,
    delete_age_restriction,
    get_mpaa_rating,
    create_mpaa_rating,
    update_mpaa_rating, delete_mpaa_rating
} from "./handlers.js";
import {headers_middleware, url_middleware} from "./middleware.js";

const app = new Application();
const router = new Router();

app.use(headers_middleware);

app.use(url_middleware('http://127.0.0.1:3000'));

router.get('/', main_page)

//роутинг для жанров
router.get('/genre', get_genre);
router.get('/genre/film', get_genre_by_film);
router.get('/genre/person', get_genre_by_person);
router.post('/create/genre', create_genre);
router.put('/update/genre', update_genre);
router.delete('/delete/genre', delete_genre);

//роутинг для личностей
router.get('/person', get_person);
router.post('/create/person', create_person);
router.put('/update/person', update_person);
router.delete('/delete/person', delete_person);
router.get('/person/prof', get_person_by_profession);
router.get('/person/genre', get_person_by_genre)
router.get('/person/film', get_person_by_film);

//роутинг для фильмов
router.get('/film', get_film);
router.post('/create/film', create_film);
router.put('/update/film', update_film);
router.delete('/delete/film', delete_film);
router.get('/film/genre', get_film_by_genre);
router.get('/film/country', get_film_by_country);
router.get('/film/prof', get_film_by_person_and_prof);

//роутинг для стран
router.get('/country', get_country);
router.get('/country/film', get_country_by_film);
router.post('/create/country', create_country);
router.put('/update/country', update_country);
router.delete('/delete/country', delete_country);

//роутинг для профессий
router.get('/prof', get_profession);
router.post('/create/prof', create_profession);
router.put('/update/prof', update_profession);
router.delete('/delete/prof', delete_profession);
router.get('/prof/film', get_profession_by_film_and_person);

//роутинг для субтитров (subtitles)
router.get('/subtitles', get_subtitles);
router.post('/create/subtitles', create_subtitles);
router.put('/update/subtitles', update_subtitles);
router.delete('/delete/subtitles', delete_subtitles);

//роутинг для переводов (translation)
router.get('/translation', get_translation);
router.post('/create/translation', create_translation);
router.put('/update/translation', update_translation);
router.delete('/delete/translation', delete_translation);

//роутинг для качества видео (video_quality)
router.get('/video_quality', get_video_quality);
router.post('/create/video_quality', create_video_quality);
router.put('/update/video_quality', update_video_quality);
router.delete('/delete/video_quality', delete_video_quality);

//роутинг для возрастных ограничений (age_restriction)
router.get('/age_restriction', get_age_restriction);
router.post('/create/age_restriction', create_age_restriction);
router.put('/update/age_restriction', update_age_restriction);
router.delete('/delete/age_restriction', delete_age_restriction);

//роутинг для MPAA ограничений (mpaa_rating)
router.get('/mpaa_rating', get_mpaa_rating);
router.post('/create/mpaa_rating', create_mpaa_rating);
router.put('/update/mpaa_rating', update_mpaa_rating);
router.delete('/delete/mpaa_rating', delete_mpaa_rating);

router.post('/create/film_country', create_film_country);
router.post('/create/film_genre', create_film_genre);
router.post('/create/film_person', create_film_person);

router.post('/create/person_genre', create_person_genre);
router.post('/create/person_prof', create_person_profession);

app.add_router(router);

app.listen();


