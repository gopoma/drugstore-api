const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookies = require("cookie-parser");
const {port} = require("./config");
const {doDBConnection} = require("./libs/db");
const passport = require("passport");

const app = express();
doDBConnection();

// Importando routers
const users = require("./routes/users");
const auth = require("./routes/auth");
const categories = require("./routes/categories");
const products = require("./routes/products");
const images = require("./routes/images");
const cart = require("./routes/cart");
const payments = require("./routes/payments");
const webhooks = require("./routes/webhooks");
const orders = require("./routes/orders");

// Importando Estrategias
const {
    useGoogleStrategy,
    useFacebookStrategy
} = require("./middleware/authProvider");

// Utilizando middleware
app.use(morgan("dev"));
app.use("/api/webhooks/stripe", express.raw({type:"application/json"}));
app.use(express.json());
app.use(cookies());
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:4200", "http://localhost:4200", "https://chapipharm-frontend.vercel.app"],
    credentials: true
}));
app.use(helmet({
    crossOriginEmbedderPolicy: false,
}));
app.use(passport.initialize());
// Utilizando Estrategias
passport.use(useGoogleStrategy());
passport.use(useFacebookStrategy());

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
auth(app);
categories(app);
products(app);
images(app);
cart(app);
payments(app);
webhooks(app);
orders(app);

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
    } else {
        console.log(err);
        return res.status(500).json({
            success: false,
            messages: ["A wild Error has appeared!"]
        });
    }
});

app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`http://localhost:${port}`);
});