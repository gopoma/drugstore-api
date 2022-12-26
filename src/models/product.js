const {mongoose} = require("../libs/db");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Por favor, proporcione un nombre"],
        maxlength: [255, "No mayor de 255 caracteres"]
    },
    laboratory: {
        type: String,
        trim: true,
        required: [true, "Por favor, proporcione un laboratorio"],
        maxlength: [255, "No mayor de 255 caracteres"]
    },
    stock: {
        type: Number,
        required: [true, "Por favor, proporcione el stock"],
        min: [1, "No menor de una unidad"]
    },
    price: {
        type: Number,
        required: [true, "Por favor, proporcione un precio"],
        min: [170, "El campo de precio tiene que ser al menos S/.1.70 o 170 céntimos de sol"]
    },
    description: {
        type: String,
        trim: true,
        required: [true, "Proporcione una descripción"]
    },
    images: [String],
    offer: {
        type: Boolean,
        default: false
    },
    categories: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
        }],
        set: (arr) => [...new Set(arr)]
    }
});

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;