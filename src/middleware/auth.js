const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config");

function authValidation(minimumRole) {
    return (req, res, next) => {
        req.neededRole = minimumRole;

        return validateToken(req, res, next);
    };
}

function validateToken(req, res, next) {
    const {token} = req.cookies;

    if(!token) {
        return res.status(403).json({
            success: false,
            messages: ["Es necesario un token para realizar este proceso"]
        });
    }

    return verifyToken(token, req, res, next);
}

function verifyToken(token, req, res, next) {
    try {
        const decoded = jwt.verify(token, jwtSecret);
        delete decoded.iat;
        delete decoded.exp;
        req.user = decoded;

        return validateRole(req, res, next);
    } catch(error) {
        return res.status(403).json({
            success: false,
            messages: ["Es necesario un token válido para realizar este proceso"]
        });
    }
}

const ROLES = {
    REGULAR: 1,
    STOREKEEPER: 25,
    ADMIN: 125
};

function validateRole(req, res, next) {
    if(ROLES[req.user.role] >= ROLES[req.neededRole]) {
        return next();
    }

    return res.status(403).json({
        success: false,
        messages: ["Permisos insuficientes. Es necesario un rol más alto"]
    });
}

module.exports = authValidation;