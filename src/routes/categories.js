const {Router} = require("express");
const CategoryService = require("../services/categories");
const authValidation = require("../middleware/auth");

function categories(app) {
    const router = Router();
    const categoryService = new CategoryService();

    app.use("/api/categories", router);

    router.get("/", authValidation("STOREKEEPER"), async (req, res) => {
        const result = await categoryService.getAll();
        return res.status(result.success ? 200 : 500).json(result);
    });

    router.post("/", authValidation("STOREKEEPER"), async (req, res) => {
        const result = await categoryService.create(req.body);
        return res.status(result.success ? 201 : 400).json(result);
    });

    router.delete("/:idCategory", authValidation("STOREKEEPER"), async (req, res) => {
        const result = await categoryService.delete(req.params.idCategory);
        return res.status(result.success ? 202 : 400).json(result);
    });
}

module.exports = categories;