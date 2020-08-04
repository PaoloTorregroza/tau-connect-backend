import path from 'path';

const config = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'nopassword',
    database: 'tconnect',
    synchronize: true,
    logging: false,
    entities: [path.join(__dirname, 'src/entity/**/**.{ts,js}')],
    migrations: [path.join(__dirname, 'src/migration/**/**.{ts,js}')],
    subscribers: [path.join(__dirname, 'src/subscriber/**/**.{ts,js}')],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
    },
};

export default config;
