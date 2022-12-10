const ProductModel = require("../models/product");
const dbError = require("../helpers/dbError");

class ProductService {
    async getAll() {
        try {
            const products = await ProductModel.find().populate("categories", "_id name");
            return {
                success: true,
                products
            };
        } catch(error) {
            return dbError(error);
        }
    }

    #parseBoolean(value) {
        return ["1", "true"].includes(value);
    }

    async search(queryFilters) {
        let {name, laboratory, stock, price, offer, category} = queryFilters;
        [name, laboratory, stock, price, offer, category] = [name?.trim(), laboratory?.trim(), stock?.trim(), price?.trim(), offer?.trim(), category?.trim()];

        let queryBody = {};
        if(name) {
            queryBody = {
                ...queryBody,
                name: {
                    $regex: `.*${name}.*`,
                    $options: "i"
                }
            };
        }
        if(laboratory) {
            queryBody = {
                ...queryBody,
                laboratory: {
                    $regex: `.*${laboratory}.*`,
                    $options: "i"
                }
            };
        }
        if(stock) {
            queryBody = {
                ...queryBody,
                stock: {$lte:stock}
            };
        }
        if(price) {
            queryBody = {
                ...queryBody,
                price: {$lte:price}
            };
        }
        if(offer) {
            queryBody = {
                ...queryBody,
                offer: this.#parseBoolean(offer)
            };
        }
        try {
            if(category) {
                const products = await ProductModel.find(queryBody).populate({
                    path: "categories",
                    match: {
                        name: {
                            $regex: `.*${category}.*`,
                            $options: "i"
                        }
                    },
                    select: "_id name"
                });
                const filtered = products.filter(product => product.categories.length > 0);
                return {
                    success: true,
                    products: filtered
                };
            } else {
                const products = await ProductModel.find(queryBody).populate("categories", "_id name");
                return {
                    success: true,
                    products
                };
            }
        } catch(error) {
            return dbError(error);
        }
    }

    async get(id) {
        try {
            const product = await ProductModel.findById(id).populate("categories", "_id name");
            if(!product) {
                return {
                    success: false,
                    messages: ["Producto no Encontrado"]
                };
            }
            return {
                success: true,
                product
            };
        } catch(error) {
            return dbError(error);
        }
    }

    async create(data) {
        try {
            const product = await (await ProductModel.create(data)).populate("categories", "_id name");
            return {
                success: true,
                product
            };
        } catch(error) {
            return dbError(error);
        }
    }

    async edit(id, data) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, data, {new:true}).populate("categories", "_id name");
            if(!product) {
                return {
                    success: false,
                    messages: ["Producto no Encontrado"]
                };
            }
            return {
                success: true,
                product
            };
        } catch(error) {
            return dbError(error);
        }
    }

    async delete(id) {
        try {
            const product = await ProductModel.findByIdAndDelete(id).populate("categories", "_id name");
            if(!product) {
                return {
                    success: false,
                    messages: ["Producto no Encontrado"]
                };
            }
            return {
                success: true,
                product
            };
        } catch(error) {
            return dbError(error);
        }
    }
}

module.exports = ProductService;