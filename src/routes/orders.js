const {Router} = require("express");
const OrderService = require("../services/orders");
const authValidation = require("../middleware/auth");

function orders(app) {
    const router = Router();
    const orderService = new OrderService();

    app.use("/api/orders", router);

    router.get("/", authValidation("REGULAR"), async (req, res) => {
        const result = await orderService.get(req.user.id);
        return res.status(result.success ? 200 : 500).json(result);
    });
}

module.exports = orders;