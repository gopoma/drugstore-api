require("dotenv").config();

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 4000,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    bucketName: process.env.BUCKET_NAME
};

config.development = config.env === "development";
config.production = config.env === "production";

module.exports = config;