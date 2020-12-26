const mongoose = require('mongoose')
const Schema = mongoose.Schema
const avatarSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    creationDate: {
        type: String,
        required: false
    },
    lastUpdate: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('Avatar', avatarSchema)