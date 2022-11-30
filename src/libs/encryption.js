const bcrypt = require("bcrypt");

async function encrypt(str) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(str, salt);

    return hash;
}

async function compare(str, hash) {
    return bcrypt.compare(str, hash);
}

module.exports = {
    encrypt,
    compare
};