const {Router} = require("express");
const AuthService = require("../services/auth");
const passport = require("passport");
const {
    tokenToCookie,
    tokenToCookieAndRedirect,
    deleteCookie
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

    router.post("/logout", (req, res) => {
        return deleteCookie(res);
    });

    router.get("/google", passport.authenticate("google", {
        scope:["email", "profile"]
    }));
    router.get("/google/callback", passport.authenticate("google", {session:false}), async (req, res) => {
        const user = req.user.profile;
        const result = await authService.socialLogin(user);
        return tokenToCookieAndRedirect(res, result, 401);
    });

    router.get("/facebook", passport.authenticate("facebook", {
        scope:["email"]
    }));
    router.get("/facebook/callback", passport.authenticate("facebook", {session:false}), async (req, res) => {
        const user = req.user.profile;
        const result = await authService.socialLogin(user);
        return tokenToCookieAndRedirect(res, result, 401);
    });
}

module.exports = auth;