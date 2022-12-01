const {production} = require("../config");

function authResponse(res, result, errCode) {
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

module.exports = {
    authResponse
};