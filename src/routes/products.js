const {Router} = require("express");
const ProductService = require("../services/products");
const authValidation = require("../middleware/auth");

function products(app) {
    const router = Router();
    const productService = new ProductService();

    app.use("/api/products", router);

    router.get("/", async (req, res) => {
        const result = await productService.getAll();
        return res.status(result.success ? 200 : 500).json(result);
    });

    router.get("/search", async (req, res) => {
        const result = await productService.search(req.query);
        return res.status(result.success ? 200 : 500).json(result);
    });

    router.get("/:idProduct", async (req, res) => {
        const result = await productService.get(req.params.idProduct);
        return res.status(result.success ? 200 : 404).json(result);
    });

    router.post("/", authValidation("STOREKEEPER"), async (req, res) => {
        const result = await productService.create(req.body);
        return res.status(result.success ? 201 : 400).json(result);
    });

    router.patch("/:idProduct", authValidation("STOREKEEPER"), async (req, res) => {
        const result = await productService.edit(req.params.idProduct, req.body);
        return res.status(result.success ? 202 : 400).json(result);
    });

    router.delete("/:idProduct", authValidation("STOREKEEPER"), async (req, res) => {
        const result = await productService.delete(req.params.idProduct);
        return res.status(result.success ? 202 : 400).json(result);
    });
}

module.exports = products;