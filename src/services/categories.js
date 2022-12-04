const CategoryModel = require("../models/category");
const dbError = require("../helpers/dbError");

class CategoryService {
    async getAll() {
        try {
            const categories = await CategoryModel.find();
            return {
                success: true,
                categories
            };
        } catch(error) {
            return dbError(error);
        }
    }

    async create(data) {
        try {
            const category = await CategoryModel.create(data);
            return {
                success: true,
                category
            };
        } catch(error) {
            return dbError(error);
        }
    }

    async delete(id) {
        try {
            const category = await CategoryModel.findByIdAndDelete(id);
            if(!category) {
                return {
                    success: false,
                    messages: ["Categoría no Encontrada"]
                };
            }
            return {
                success: true,
                category
            };
        } catch(error) {
            return dbError(error);
        }
    }
}

module.exports = CategoryService;