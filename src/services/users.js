const UserModel = require("../models/user");
const {encrypt} = require("../libs/encryption");
const dbError = require("../helpers/dbError");

class UserService {
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

    async create(data) {
        try {
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
}

module.exports = UserService;