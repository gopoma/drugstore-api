const mongoose = require("mongoose");
const {
    dbUsername,
    dbPassword,
    dbHost,
    dbName
} = require("../config");

async function doDBConnection() {
    const dbURI = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;
    const conn = await mongoose.connect(dbURI);
    // eslint-disable-next-line
    console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = {
    doDBConnection,
    mongoose
};