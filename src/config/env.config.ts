export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongo_db: process.env.MONGO_DB,
    dbName: process.env.DB_NAME,
    port: process.env.PORT || 3000,
    defaultLimit: +process.env.DEFAULT_LIMIT || 7,
});