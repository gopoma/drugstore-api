const {mongoose} = require("../libs/db");

const imageSchema = mongoose.Schema({
    originalName: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
        unique: true
    },
    resourceURL: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true});

const ImageModel = mongoose.model("image", imageSchema);

module.exports = ImageModel;