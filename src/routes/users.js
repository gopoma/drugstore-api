const {Router} = require("express");
const UserService = require("../services/users");
const authValidation = require("../middleware/auth");

function users(app) {
    const router = Router();
    const userService = new UserService();

    app.use("/api/users", router);

    router.post("/", authValidation("ADMIN"), async (req, res) => {
        const result = await userService.create(req.body, true);
        return res.status(201).json(result);
    });
}

module.exports = users;