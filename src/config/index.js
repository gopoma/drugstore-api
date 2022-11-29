require("dotenv").config();

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 4000,
};

config.development = config.env === "development";
config.production = config.env === "production";

module.exports = config;