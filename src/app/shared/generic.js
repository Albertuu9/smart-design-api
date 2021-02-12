const jwt = require('jsonwebtoken')
const platform = require('./../settings/settings')

function generateToken() {
    const payload = {
        check: true
    };
    const token = jwt.sign(payload, platform.settings.secret, {
        expiresIn: '48h'
    });
    return token
}

module.exports = {
    generateToken
}