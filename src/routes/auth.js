const {Router} = require("express");
const AuthService = require("../services/auth");
const {authResponse} = require("../helpers/authResponse");

function auth(app) {
    const router = Router();
    const authService = new AuthService();

    app.use("/api/auth", router);

    router.post("/signup", async (req, res) => {
        const result = await authService.signup(req.body);
        return authResponse(res, result, 400);
    });
}

module.exports = auth;