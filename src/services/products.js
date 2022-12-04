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