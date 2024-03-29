const {Router} = require("express");
const PaymentsService = require("../services/payments");

function webhooks(app) {
    const router = Router();
    const paymentsService = new PaymentsService();

    app.use("/api/webhooks", router);

    router.post("/stripe", async (req, res) => {
        const sig = req.headers["stripe-signature"];

        const result = await paymentsService.confirmStripe(req.body, sig);
        return res.status(result.success ? 200 : 400).json(result);
    });
}

module.exports = webhooks;