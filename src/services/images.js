const ImageModel = require("../models/image");
const {
    getFile,
    uploadFiles,
    deleteFile
} = require("../libs/storage");
const dbError = require("../helpers/dbError");

class ImageService {
    async getAll() {
        try {
            const images = await ImageModel.find();
            return {
                success: true,
                images
            };
        } catch(error) {
            return dbError(error);
        }
    }

    async get(fileName, res, download = false) {
        try {
            const image = await ImageModel.findOne({fileName});
            if(!image) {
                return {
                    success: false,
                    messages: ["Imagen no Encontrada"]
                };
            }

            return getFile(fileName, res, download);
        } catch(error) {
            return dbError(error);
        }
    }

    async uploadMany(files) {
        if(!files || files?.length === 0) {
            return {
                success: false,
                messages: ["Por favor, introduzca al menos una imagen"]
            };
        }

        const results = await uploadFiles(files);
        const okFiltered = results.filter(result => result.value.success);
        const processed = okFiltered.map(result => {
            const {success, message, ...imageData} = result.value;
            return imageData;
        });

        try {
            const images = await ImageModel.insertMany(processed);
            return {
                success: true,
                images
            };
        } catch(error) {
            return dbError(error);
        }
    }

    async deleteMany(fileNames) {
        if(!fileNames || fileNames?.length === 0) {
            return {
                success: false,
                messages: ["Por favor, proporcione al menos un nombre de imagen"]
            };
        }

        const resultPromises = fileNames.map(async (fileName) => {
            const result = await deleteFile(fileName);
            if(result.success) {
                try {
                    await ImageModel.deleteOne({fileName}, {new:true});
                    return {
                        success: true,
                        message: result.message,
                        fileName
                    };
                } catch(error) {
                    return dbError(error);
                }
            } else {
                return result;
            }
        });

        return (await Promise.allSettled(resultPromises)).map(result => result.value);
    }
}

module.exports = ImageService;