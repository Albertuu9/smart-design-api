const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    userType: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        required: false
    },
    // 0 premium, 1 standard, 2 guest
    role: {
        type: Number,
        required: false
    },
    creationDate: {
        type: String,
        required: false
    },
    lastUpdate: {
        type: String,
        required: false
    },
    settings: {
        type: Object,
        required: false
    }
})

module.exports = mongoose.model('User', userSchema)