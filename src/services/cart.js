const dbError = require("../helpers/dbError");
const CartModel = require("../models/cart");
const ProductService = require("./products");

class CartService {
    async create(idUser) {
        const cart = await CartModel.create({
            _id: idUser,
            items: []
        });

        return cart;
    }

    async getItems(idUser) {
        try {
            const items = await CartModel.findById(idUser).populate("items.product", "name laboratory price images");
            return {
                success: true,
                items
            };
        } catch(error) {
            return dbError(error);
        }
    }

    async addItem(idUser, idProduct, amount) {
        const productService = new ProductService();
        const {success:found, product} = await productService.get(idProduct);

        if(!amount || amount < 0) {
            return {
                success: false,
                messages: ["Cantidad no Válida"]
            };
        }

        if(!found) {
            return {
                success: false,
                messages: ["Producto no Encontrado"]
            };
        }

        if(amount > product.stock) {
            return {
                success: false,
                messages: ["Cantidad excede al tamaño del Stock"]
            };
        }

        try {
            const cartWithProductAlready = await CartModel.findOne({
                _id: idUser,
                "items.product": idProduct
            });
            const alreadyInCart = Boolean(cartWithProductAlready);

            if(!alreadyInCart) {
                const cart = await CartModel.findByIdAndUpdate(idUser, {
                    $push: {
                        items: {
                            product: idProduct,
                            amount
                        }
                    }
                }, {new:true}).populate("items.product", "name laboratory price images");
                return {
                    success: true,
                    cart
                };
            } else {
                const productAlreadyIn = cartWithProductAlready.items.find((item) => String(item.product) === idProduct);
                if(amount + productAlreadyIn.amount > product.stock) {
                    return {
                        success: false,
                        messages: ["Cantidad excede al tamaño del Stock"]
                    };
                }

                await CartModel.updateOne(
                    {
                        _id: idUser,
                        "items.product": idProduct
                    },
                    {$inc: {"items.$.amount": amount}}, {new:true}).populate("items.product", "name laboratory price images");
                const cart = await CartModel.findById(idUser).populate("items.product", "name laboratory price images");
                return {
                    success: true,
                    cart
                };
            }
        } catch(error) {
            return dbError(error);
        }
    }

    async removeItem(idUser, idProduct) {
        try {
            const cart = await CartModel.findByIdAndUpdate(idUser, {
                $pull: {
                    items: {
                        product: idProduct
                    }
                }
            }, {new:true});
            return {
                success: true,
                cart
            };
        } catch(error) {
            return dbError(error);
        }
    }
}

module.exports = CartService;