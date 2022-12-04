const {production} = require("../config");

function tokenToCookie(res, result, errCode) {
    if(result.success) {
        const {token, ...data} = result;

        return res.cookie("token", token, {
            httpOnly: true,
            secure: production,
            sameSite: "none",
            expires: new Date(new Date().setDate(new Date().getDate()+7))
        }).json(data);
    }

    return res.status(errCode).json(result);
}

function tokenToCookieAndRedirect(res, result, errCode) {
    if(result.success) {
        const {token} = result;

        return res.cookie("token", token, {
            httpOnly: true,
            secure: production,
            sameSite: "none",
            expires: new Date(new Date().setDate(new Date().getDate() + 7))
        }).redirect(production ? "http://localhost:4200" : "http://localhost:4200");
    }

    return res.status(errCode).json(result);
}

function deleteCookie(res) {
    return res.cookie("token", "", {
        httpOnly: true,
        secure: production,
        sameSite: "none",
        expires: new Date()
    }).json({
        success: true,
        message: "Sesión cerrada exitosamente"
    });
}

module.exports = {
    tokenToCookie,
    tokenToCookieAndRedirect,
    deleteCookie
};