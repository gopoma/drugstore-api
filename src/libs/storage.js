const {Storage} = require("@google-cloud/storage");
const path = require("path");
const uuid = require("uuid");
const {Readable} = require("stream");
const {bucketName} = require("../config");

const storage = new Storage({
    keyFilename: "credentials.json"
});

const uploadFile = (file) => {
    if(!file) {
        return {
            success: false,
            message: "Es necesario enviar un archivo"
        };
    }

    const ext = path.extname(file.originalname);
    const fileName = `${uuid.v4()}${ext}`;
    const cloudFile = storage.bucket(bucketName).file(fileName);
    const fileStream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
        fileStream.pipe(cloudFile.createWriteStream()).on("finish", () => {
            resolve({
                success: true,
                message: "El archivo se ha subido exitosamente",
                originalName: file.originalname,
                fileName,
                resourceURL: `https://storage.googleapis.com/${bucketName}/${fileName}`
            });
        }).on("error", () => {
            reject({
                success: false,
                message: "No se ha podido subir el archivo"
            });
        });
    });
};

module.exports = {
    uploadFile
};