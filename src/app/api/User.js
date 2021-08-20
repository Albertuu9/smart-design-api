// models
const User = require('../models/user');

function getUserById(id){
    return User.find({_id: id},{ creationDate: 0, lastUpdate: 0, password: 0, settings: 0 })
}

function checkMailExists(email) {
    return User.find({ email: email })
}

// crud functions

function insert(user){
    return user.save();
}

function updateById(id, user, callback){
    return User.findByIdAndUpdate(id, user, callback);
}

function deleteById(id, callback){
    return User.deleteOne({ id }, callback);
}

module.exports = {
    getUserById,
    checkMailExists,
    insert,
    updateById,
    deleteById
}