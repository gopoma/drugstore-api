const OrderModel = require("../models/order");
const dbError = require("../helpers/dbError");

class OrderService {
    async get(idUser) {
        try {
            const results = await OrderModel.find({user:idUser}).populate("items.product", "name laboratory price images") ?? [];
            const orders = results.map(result => ({
                items: result.items.map(item => ({
                    ...item.product._doc,
                    amount: item.amount
                })),
                completed: result.completed
            }));
            return {
                success: true,
                orders
            };
        } catch(error) {
            return dbError(error);
        }
    }

    async create(idUser, items) {
        try {
            const order = await OrderModel.create({
                user: idUser,
                items,
                completed: false
            });
            return {
                success: true,
                order
            };
        } catch(error) {
            return dbError(error);
        }
    }
}

module.exports = OrderService;