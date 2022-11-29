const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const {port} = require("./config");
const {doDBConnection} = require("./libs/db");

const app = express();
doDBConnection();

// Utilizando middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:4200"],
    credentials: true
}));

app.get("/", (req, res) => {
    return res.json({
        name: "chapipharm-backend",
        version: "1.0.0",
        authors: [
            "Huamani Luque, Diego Alonso",
            "Ordoño Poma, Gustavo Eduardo",
            "Pacori Anccasi, Diego Ivan"
        ]
    });
});

app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`http://localhost:${port}`);
});