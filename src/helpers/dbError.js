function dbError(error) {
    if(error.name === "CastError" && error.kind === "ObjectId") {
        return {
            success: false,
            messages: ["Introduzca un id válido"]
        };
    }
    const messages = Object.values(error.errors).map(error => error.message);
    return {
        success: false,
        messages
    };
}

module.exports = dbError;