const bcrypt = require("bcrypt");

async function encrypt(str) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(str, salt);

    return hash;
}

async function compare(str, hash) {
    try {
        return await bcrypt.compare(str, hash);
    } catch(error) {
        return false;
    }
}

module.exports = {
    encrypt,
    compare
};