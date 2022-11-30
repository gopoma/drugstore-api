const UserModel = require("../models/user");
const dbError = require("../helpers/dbError");

class UserService {
    async create(data) {
        try {
            if(!data.displayName?.trim()) {
                data.displayName = `${data.firstName} ${data.lastName}`;
            }

            const user = await UserModel.create(data);
            return {
                success: true,
                user
            };
        } catch(error) {
            return dbError(error);
        }
    }
}

module.exports = UserService;