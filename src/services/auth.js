const UserService = require("./users");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config");

class AuthService {
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

    async signup(data) {
        data.provider = {local:true};

        const userService = new UserService();
        const result = await userService.create(data);

        if(!result.success) {
            return {
                success: false,
                messages: result.messages
            };
        }
        return this.#getUserData(result.user);
    }
}

module.exports = AuthService;