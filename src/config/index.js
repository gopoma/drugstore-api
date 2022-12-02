require("dotenv").config();

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    bucketName: process.env.BUCKET_NAME,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailSecure: process.env.EMAIL_SECURE === "true",
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD
};

config.development = config.env === "development";
config.production = config.env === "production";

module.exports = config;