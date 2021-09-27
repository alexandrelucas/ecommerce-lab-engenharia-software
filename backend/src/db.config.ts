import { Client } from 'pg';

const PgDatabase = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'vino',
    port: 5432
});

PgDatabase.connect();

export default PgDatabase;