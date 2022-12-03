const UserModel = require("../models/user");
const {encrypt} = require("../libs/encryption");
const uuid = require("uuid");
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
            } else {
                data.provider = {local:true};
                data.isEmailValid = true;
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

    async getOrCreateByProvider(data) {
        const user = await UserModel.findOne({email: data.email});
        if(user?.provider[data.provider] && user?.idProvider[data.provider] === data.idProvider) {
            return {
                success: true,
                user
            };
        }

        if(!user?.firstName) {
            data.firstName = "Por asignar";
        }
        if(!user?.lastName) {
            data.lastName = "Por asignar";
        }
        if(!user?.password) {
            data.password = uuid.v4();
        }
        data.isEmailValid = true;
        const newData = {
            ...data,
            provider: {
                [data.provider]: true
            },
            idProvider: {
                [data.provider]: data.idProvider
            }
        };
        try {
            const user = await UserModel.create(newData);

            return {
                success: true,
                user
            };
        } catch(error) {
            const emailError = error?.errors?.email;
            if(emailError?.kind === "unique" && emailError?.value) { // Duplicated Entry
                const email = emailError.value;
                const user = await UserModel.findOneAndUpdate({email}, {
                    [`provider.${data.provider}`]: true,
                    [`idProvider.${data.provider}`]: data.idProvider
                }, {new:true});

                return {
                    success: true,
                    user
                };
            }
            return dbError(error);
        }
    }
}

module.exports = UserService;