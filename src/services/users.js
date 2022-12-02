const UserModel = require("../models/user");
const {encrypt} = require("../libs/encryption");
const dbError = require("../helpers/dbError");

class UserService {
    async getByEmail(email) {
        const user = await UserModel.findOne({email});
        return user;
    }

    #getNormalizedUser(user) {
        const normalizedUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            email: user.email,
            location: user.location,
            role: user.role,
            profilePicture: user.profilePicture
        };

        return normalizedUser;
    }

    async create(data, trusted=false) {
        try {
            if(!trusted) {
                delete data.role;
                delete data.idProvider;
            }
            if(!data.displayName?.trim()) {
                data.displayName = `${data.firstName} ${data.lastName}`;
            }
            if(data.password) {
                data.password = await encrypt(data.password);
            }

            const user = await UserModel.create(data);
            return {
                success: true,
                user: this.#getNormalizedUser(user)
            };
        } catch(error) {
            return dbError(error);
        }
    }

    async getByEmailValidationUUID(emailValidationUUID) {
        const user = await UserModel.findOne({emailValidationUUID});
        return user;
    }

    async validateUser(emailValidationUUID) {
        const user = await UserModel.findOneAndUpdate({emailValidationUUID}, {
            emailValidationUUID: null,
            isEmailValid: true
        }, {new:true});
        return user;
    }
}

module.exports = UserService;