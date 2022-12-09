const {Storage} = require("@google-cloud/storage");
const path = require("path");
const uuid = require("uuid");
const {Readable} = require("stream");
const {
    bucketName,
    production,
    callbackURL,
    callbackURLDev
} = require("../config");

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
                resourceURL: `${production ? callbackURL : callbackURLDev}/api/images/${fileName}`
            });
        }).on("error", () => {
            reject({
                success: false,
                message: "No se ha podido subir el archivo"
            });
        });
    });
};

const uploadFiles = async (files) => {
    const promises = files.map(file => uploadFile(file));
    const results = await Promise.allSettled(promises);

    return results;
};

const getFile = (fileName, res, download) => {
    const cloudFile = storage.bucket(bucketName).file(fileName);
    const stream = cloudFile.createReadStream();

    return new Promise((resolve, reject) => {
        stream.on("error", () => {
            reject({
                success: false,
                messages: ["No se ha podido descargar el archivo"]
            });
        });

        const ext = path.extname(fileName);
        const dotSplitted = ext.split(".");
        const format = dotSplitted[1];
        if(download) {
            res.writeHead(200, {
                "Content-Type": `image/${format}`,
                "Content-Disposition": `attachment; filename=${fileName}`
            });
        } else {
            res.writeHead(200, {
                "Content-Type": `image/${format}`
            });
        }
        stream.pipe(res);

        stream.on("end", () => {
            resolve({
                success: true,
                message: "Archivo descargado exitosamente"
            });
        });
    });
};

const deleteFile = async (fileName) => {
    if(!fileName?.trim()) {
        return {
            success: false,
            message: "Por favor, proporcione un nombre de archivo"
        };
    }

    const cloudFile = storage.bucket(bucketName).file(fileName);
    try {
        await cloudFile.delete();

        return {
            success: true,
            message: "El archivo se ha eliminado exitosamente",
            fileName
        };
    } catch(error) {
        if(error.code === 404) {
            return {
                success: false,
                message: "Archivo no Encontrado"
            };
        }
        return {
            success: false,
            message: "No se ha podido Eliminar el Archivo"
        };
    }
};

module.exports = {
    uploadFiles,
    getFile,
    deleteFile
};