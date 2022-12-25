const {Router} = require("express");
const CartService = require("../services/cart");
const authValidation = require("../middleware/auth");

function cart(app) {
    const router = Router();
    const cartService = new CartService();

    app.use("/api/cart", router);

    router.get("/", authValidation("REGULAR"), async (req, res) => {
        const result = await cartService.getItems(req.user.id);
        return res.status(result.success ? 200 : 500).json(result);
    });

    router.post("/add", authValidation("REGULAR"), async (req, res) => {
        const {idProduct, amount} = req.body;
        const result = await cartService.addItem(req.user.id, idProduct, amount);
        return res.status(result.success ? 202 : 400).json(result);
    });
}

module.exports = cart;