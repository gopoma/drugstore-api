const {Router} = require("express");
const ImageService = require("../services/images");
const authValidation = require("../middleware/auth");
const upload = require("../middleware/upload");

function images(app) {
    const router = Router();
    const imageService = new ImageService();

    app.use("/api/images", router);

    router.get("/", authValidation("ADMIN"), async (req, res) => {
        const result = await imageService.getAll();
        return res.status(result.success ? 200 : 500).json(result);
    });

    router.get("/:fileName/download", async (req, res) => {
        const result = await imageService.get(req.params.fileName, res);
        if(!result.success) {
            return res.status(404).json(result);
        }
        return res.end();
    });

    router.post("/", upload.array("images"), async (req, res) => {
        const result = await imageService.uploadMany(req.files);
        return res.status(result.success ? 201 : 500).json(result);
    });

    router.delete("/", authValidation("ADMIN"), async (req, res) => {
        const result = await imageService.deleteMany(req.body.fileNames);
        return res.status(202).json(result);
    });
}

module.exports = images;