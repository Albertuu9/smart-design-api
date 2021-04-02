// models
const User = require('../models/user');

function getUserById(id){
    return User.find({_id: id},{ creationDate: 0, lastUpdate: 0, password: 0, settings: 0 })
}

module.exports = {
    getUserById
}