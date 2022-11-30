const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const {port} = require("./config");
const {doDBConnection} = require("./libs/db");

const app = express();
doDBConnection();

// Importando routers
const users = require("./routes/users");

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

// Utilizando las rutas
users(app);

app.use((err, req, res, next) => {
    if(err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
            success: false,
            messages: ["Envío de Imagen inválido"]
        });
    } else if(err.code === "INVALID_FILE_FORMAT") {
        return res.status(400).json({
            success: false,
            messages: [err.message]
        });
    } else if(err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            messages: ["Límite de Tamaño de Imagen Excedido (4MB)"]
        });
    }
});

app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`http://localhost:${port}`);
});