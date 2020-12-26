const bcrypt = require('bcrypt')

async function encryptPassword(password){
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

async function decryptPassword(password, passwordDB){
    const userExists = await bcrypt.compare(password, passwordDB)
    return userExists
}

module.exports = { encryptPassword, decryptPassword }