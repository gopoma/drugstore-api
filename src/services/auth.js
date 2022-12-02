const UserService = require("./users");
const uuid = require("uuid");
const transporter = require("../libs/email");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config");

class AuthService {
    async signup(data) {
        data.provider = {local:true};
        data.emailValidationUUID = uuid.v4();

        const userService = new UserService();
        const result = await userService.create(data);

        if(!result.success) {
            return {
                success: false,
                messages: result.messages
            };
        }

        transporter.sendMail({
            from: "GustavoEdu10111213@gmail.com",
            to: data.email,
            subject: "[chapipharm] Completa tu registro",
            template: "verification",
            context: {
                verificationURL: `http://localhost:4000/api/auth/${data.emailValidationUUID}`
            }
        });
        return {
            success: true,
            user: result.user,
            messages: ["Completa tu registro a través del mensaje que enviamos a tu Correo Electrónico"]
        };
    }

    #createToken(payload) {
        const token = jwt.sign(payload, jwtSecret, {
            expiresIn: "7d"
        });
        return token;
    }

    #getUserData(user) {
        const userWithNoSensitiveData = {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            provider: user.provider,
            idProvider: user.idProvider,
        };

        const token = this.#createToken(userWithNoSensitiveData);
        return {
            success: true,
            user: userWithNoSensitiveData,
            token
        };
    }
}

module.exports = AuthService;