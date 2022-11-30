const UserModel = require("../models/user");
const {uploadFile} = require("../libs/storage");

class UserService {
    async create(data, file) {
        try {
            if(!data.displayName) {
                data.displayName = `${data.firstName} ${data.lastName}`;
            }

            const uploaded = await uploadFile(file);
            if(uploaded.success) {
                const user = await UserModel.create({
                    ...data,
                    profilePicture: uploaded.resourceURL
                });
                return {
                    success: true,
                    user
                };
            } else {
                const user = await UserModel.create(data);
                return {
                    success: true,
                    user
                };
            }
        } catch(error) {
            console.log(error.name);
            console.log(error.code);
        }
    }
}

module.exports = UserService;