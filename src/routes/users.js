const {Router} = require("express");
const upload = require("../middleware/upload");
const UserService = require("../services/users");

function users(app) {
    const router = Router();
    const userService = new UserService();

    app.use("/api/users", router);

    router.post("/", upload.single("img"), async (req, res) => {
        console.log(req.file);
        return res.json({ok:true});
        // const result = await userService.create(req.body);
        // return res.status(201).json(result);
    });
}

module.exports = users;