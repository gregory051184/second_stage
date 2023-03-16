import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'films_2'
});

export default pool;
