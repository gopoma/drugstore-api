function dbError({errors}) {
    const messages = Object.values(errors).map(error => error.message);
    return {
        success: false,
        messages
    };
}

module.exports = dbError;