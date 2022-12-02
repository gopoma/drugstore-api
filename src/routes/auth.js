const {Router} = require("express");
const AuthService = require("../services/auth");
const {
    tokenToCookie,
    tokenToCookieAndRedirect
} = require("../helpers/authResponse");

function auth(app) {
    const router = Router();
    const authService = new AuthService();

    app.use("/api/auth", router);

    router.post("/login", async (req, res) => {
        const result = await authService.login(req.body);
        return tokenToCookie(res, result, 401);
    });

    router.post("/signup", async (req, res) => {
        const result = await authService.signup(req.body);
        return res.status(result.success ? 201 : 400).json(result);
    });

    router.get("/verify/:emailVerificationUUID", async (req, res) => {
        const result = await authService.validateEmail(req.params.emailVerificationUUID);
        return tokenToCookieAndRedirect(res, result, 400);
    });
}

module.exports = auth;