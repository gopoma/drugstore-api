const UserModel = require("../models/user");

class UserService {
    async create(data) {
        try {
            const user = await UserModel.create(data);
            return {
                success: true,
                user
            };
        } catch(error) {
            console.log(error);
        }
    }
}

module.exports = UserService;