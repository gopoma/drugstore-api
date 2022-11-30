const multer = require("multer");

const storage = multer.memoryStorage();

const ALLOWED_MYMETYPES = [
    "image/gif",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
];

const upload = multer({
    storage,
    limits: {
        fileSize: 4194304
    },
    fileFilter: (req, file, done) => {
        if(!ALLOWED_MYMETYPES.includes(file.mimetype)) {
            const err = new Error("Imagen no válida");
            err.code = "INVALID_FILE_FORMAT";
            return done(err, false);
        }

        return done(null, true);
    }
});

module.exports = upload;