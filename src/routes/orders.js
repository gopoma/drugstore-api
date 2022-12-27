const {Router} = require("express");
const OrderService = require("../services/orders");
const authValidation = require("../middleware/auth");

function orders(app) {
    const router = Router();
    const orderService = new OrderService();

    app.use("/api/orders", router);

    router.get("/", authValidation("REGULAR"), async (req, res) => {
        const result = await orderService.getRelated(req.user.id);
        return res.status(result.success ? 200 : 500).json(result);
    });

    router.get("/:idOrder", authValidation("REGULAR"), async (req, res) => {
        const result = await orderService.get(req.params.idOrder);
        if(result.success && req.user.id !== result.order.user.id && req.user.role === "REGULAR") {
            return res.status(403).json({
                success: false,
                messages: ["Permisos insuficientes. Es necesario un rol más alto"]
            });
        }
        return res.status(result.success ? 200 : 500).json(result);
    });
}

module.exports = orders;