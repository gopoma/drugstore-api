const OrderModel = require("../models/order");
const dbError = require("../helpers/dbError");
const path = require("path");
const fs = require("fs");
const pdf = require("pdf-creator-node");

class OrderService {
    async getRelated(idUser) {
        try {
            const results = await OrderModel.find({user:idUser}).populate("items.product", "name laboratory price images") ?? [];
            const orders = results.map(result => ({
                _id: result._id,
                items: result.items.map(item => ({
                    ...item.product._doc,
                    amount: item.amount
                })),
                completed: result.completed,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
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

    async get(idOrder) {
        try {
            const order = await OrderModel.findById(idOrder).populate("items.product", "name laboratory price images").populate("user", "email displayName profilePicture");
            if(!order) {
                return {
                    success: false,
                    messages: ["Orden no Encontrada"]
                };
            }
            const items = order.items.map(item => ({
                ...item.product._doc,
                amount: item.amount
            }));

            return {
                success: true,
                order: {
                    ...order._doc,
                    items
                }
            };
        } catch(error) {
            return dbError(error);
        }
    }
}

module.exports = OrderService;