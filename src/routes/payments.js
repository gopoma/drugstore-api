const {Router} = require("express");
const PaymentsService = require("../services/payments");
const authValidation = require("../middleware/auth");

function payments(app) {
    const router = Router();
    const paymentsService = new PaymentsService();

    app.use("/api/payments", router);

    router.post("/createStripeIntent", authValidation("REGULAR"), async (req, res) => {
        const result = await paymentsService.createStripeIntent(req.user.id, req.user.stripeCustomerID);
        return res.status(result.success ? 202 : 400).json(result);
    });
}

module.exports = payments;