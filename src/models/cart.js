const {mongoose} = require("../libs/db");

const cartSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            amount: Number
        }
    ]
});

const CartModel = mongoose.model("cart", cartSchema);

module.exports = CartModel;