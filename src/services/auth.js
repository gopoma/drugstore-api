const UserService = require("./users");
const uuid = require("uuid");
const transporter = require("../libs/email");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config");
const {compare} = require("../libs/encryption");

class AuthService {
    async login(data) {
        const {email, password} = data;
        const messages = [];
        if(!email) {
            messages.push("Por favor, proporcione un Correo Electrónico");
        }
        if(!password) {
            messages.push("Por favor, proporcione una Contraseña");
        }
        if(!email || !password) {
            return {
                success: false,
                messages
            };
        }

        const userService = new UserService();
        const user = await userService.getByEmail(email);

        const ok = await compare(password, user?.password);
        if(!user || !ok) {
            return {
                success: false,
                messages: ["Las credenciales son incorrectas"]
            };
        }

        if(!user.isEmailValid) {
            return {
                success: false,
                messages: ["Termine de crear su cuenta validando su Correo Electrónico"]
            };
        }
        return this.#getUserData(user);
    }

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
                verificationURL: `http://localhost:4000/api/auth/verify/${data.emailValidationUUID}`
            }
        });
        return {
            success: true,
            user: result.user,
            messages: ["Completa tu registro a través del mensaje que enviamos a tu Correo Electrónico"]
        };
    }

    async validateEmail(emailVerificationUUID) {
        const userService = new UserService();
        const user = await userService.getByEmailValidationUUID(emailVerificationUUID);

        if(!user) {
            return {
                success: false,
                messages: ["Tal vez ya se halla utilizado este código de validación. Verifica tu URL"]
            };
        }
        const validatedUser = await userService.validateUser(emailVerificationUUID);
        return this.#getUserData(validatedUser);
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