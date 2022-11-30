const {Router} = require("express");
const UserService = require("../services/users");

function users(app) {
    const router = Router();
    const userService = new UserService();

    app.use("/api/users", router);

    router.post("/", async (req, res) => {
        const result = await userService.create(req.body);
        return res.status(201).json(result);
    });
}

module.exports = users;