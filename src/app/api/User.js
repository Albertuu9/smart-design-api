// models
const User = require('../models/user');

function getUserById(id){
    return User.find({_id: id})
}

module.exports = {
    getUserById
}