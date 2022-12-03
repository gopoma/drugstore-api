const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const {
    production,
    callbackURL,
    callbackURLDev,
    oauthClientID,
    oauthClientSecret,
    facebookAppID,
    facebookAppSecret
} = require("../config");

const buildCallbackURL = (provider) => `${production?callbackURL:callbackURLDev}/api/auth/${provider}/callback`;
const getProfile = (accessToken, refreshToken, profile, done) => {
    done(null, {profile});
};

const useGoogleStrategy = () => {
    return new GoogleStrategy({
        clientID: oauthClientID,
        clientSecret: oauthClientSecret,
        callbackURL: buildCallbackURL("google")
    }, getProfile);
};
const useFacebookStrategy = () => {
    return new FacebookStrategy({
        clientID: facebookAppID,
        clientSecret: facebookAppSecret,
        callbackURL: buildCallbackURL("facebook"),
        profileFields: ["id", "emails", "displayName", "name", "photos"]
    }, getProfile);
};

module.exports = {
    useGoogleStrategy,
    useFacebookStrategy
};