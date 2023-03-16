import pkg from 'pg';
//import dotenv from "dotenv";

//dotenv.config();

const { Pool } = pkg;


const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'cinema_2'
});

export default pool;
