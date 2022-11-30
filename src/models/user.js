const {mongoose} = require("../libs/db");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "Por favor, proporcione un nombre"],
        maxlength: [1024, "No mayor de 1024 caracteres"]
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "Por favor, proporcione los apellidos"],
        maxlength: [1024, "No mayor de 1024 caracteres"]
    },
    displayName: String,
    email: {
        type: String,
        trim: true,
        required: [true, "Por favor, proporcione un correo electrónico"],
        unique: [true, "Correo electrónico ya registrado"],
        match: [/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "Correo electrónico inválido"]
    },
    password: {
        type: String,
        required: [true, "Por favor, proporcione una contraseña"]
    },
    location: {
        country: String,
        state: String,
        city: String,
        district: String
    },
    role: {
        type: String,
        enum: {
            values: ["REGULAR", "ADMIN"],
            message: "Introduzca un rol válido"
        },
        default: "REGULAR"
    },
    profilePicture: String,
    isEmailValid: {
        type: Boolean,
        default: false
    },
    emailValidationUUID: String,
    provider: {
        local: Boolean,
        facebook: Boolean,
        google: Boolean,
        twitter: Boolean,
        github: Boolean
    },
    idProvider: {
        facebook: String,
        google: String,
        twitter: String,
        github: String
    }
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;