const {mongoose} = require("../libs/db");

const orderSchema = new mongoose.Schema({
    user: {
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
    ],
    completed: {
        type: Boolean,
        default: false
    }
});

const OrderSchema = mongoose.model("order", orderSchema);

module.exports = OrderSchema;