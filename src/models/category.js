const {mongoose} = require("../libs/db");
const uniqueValidator = require("mongoose-unique-validator");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Por favor, proporcione un nombre"],
        maxlength: [120, "No mayor de 120 caracteres"],
        unique: true,
        lowercase: true
    }
}, {timestamps:true});
categorySchema.plugin(uniqueValidator, {message:"{VALUE} ya ha sido registrado"});

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;