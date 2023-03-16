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
    get_film_by_person,
    get_film_by_genre,
    get_genre,
    get_person,
    main_page,
    update_film,
    update_genre,
    update_person,
    get_actor,
    create_actor,
    update_actor,
    delete_actor,
    get_dubbing_actor,
    create_dubbing_actor,
    update_dubbing_actor,
    delete_dubbing_actor,
    get_dubbing_actor_by_film,
    get_person_by_film,
    get_actor_by_film,
    get_film_by_actor,
    get_film_by_dubbing_actor,
    get_country_by_film,
    get_film_by_country,
    get_genre_by_film,
    get_country,
    create_country,
    update_country,
    delete_country,
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
    update_mpaa_rating,
    delete_mpaa_rating, create_film_country, create_film_actor, create_film_dubbing_actor, create_film_genre
} from "./handlers.js";
import {headers_middleware, url_middleware} from "./middleware.js";
import dotenv from "dotenv"

const app = new Application();
const router = new Router();

app.use(headers_middleware);

app.use(url_middleware('http://127.0.0.1:3000'));

router.get('/', main_page)

//роутинг для жанров
router.get('/genre', get_genre);
router.get('/genre/film', get_genre_by_film);
router.post('/create/genre', create_genre);
router.put('/update/genre', update_genre);
router.delete('/delete/genre', delete_genre);

//роутинг для личностей
router.get('/person', get_person);
router.post('/create/person', create_person);
router.put('/update/person', update_person);
router.delete('/delete/person', delete_person);
router.get('/person/film', get_person_by_film);

//роутинг для актёров дубляжа
router.get('/dubbing_actor', get_dubbing_actor);
router.post('/create/dubbing_actor', create_dubbing_actor);
router.put('/update/dubbing_actor', update_dubbing_actor);
router.delete('/delete/dubbing_actor', delete_dubbing_actor);
router.get('/dubbing_actor/film', get_dubbing_actor_by_film);

//роутинг для актёров
router.get('/actor', get_actor);
router.post('/create/actor', create_actor);
router.put('/update/actor', update_actor);
router.delete('/delete/actor', delete_actor);
router.get('/actor/film', get_actor_by_film);

//роутинг для фильмов
router.get('/film', get_film);
router.post('/create/film', create_film);
router.put('/update/film', update_film);
router.delete('/delete/film', delete_film);
router.get('/film/genre', get_film_by_genre);
router.get('/film/person', get_film_by_person);
router.get('/film/actor', get_film_by_actor);
router.get('/film/dubbing_actor', get_film_by_dubbing_actor);
router.get('/film/country', get_film_by_country);

//роутинг для стран
router.get('/country', get_country);
router.get('/country/film', get_country_by_film);
router.post('/create/country', create_country);
router.put('/update/country', update_country);
router.delete('/delete/country', delete_country);

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
router.post('/create/film_actor', create_film_actor);
router.post('/create/film_dubbing_actor', create_film_dubbing_actor);
router.post('/create/film_genre', create_film_genre);

app.add_router(router);

app.listen();


