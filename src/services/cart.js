const CartModel = require("../models/cart");

class CartService {
    async create(idUser) {
        const cart = await CartModel.create({
            _id: idUser,
            items: []
        });

        return cart;
    }
}

module.exports = CartService;