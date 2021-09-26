import { Client } from 'pg';

const PgDatabase = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'vino_novo',
    port: 5432
});

PgDatabase.connect();

export default PgDatabase;