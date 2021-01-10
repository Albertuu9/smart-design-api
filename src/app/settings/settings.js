require('dotenv').config();

const settings = {
    port: '3000',
    dbUri: 'mongodb+srv://albertuu9:'+process.env.MONGO_PASSWORD+'@smartdesign.eqhqt.mongodb.net/smartdesign?retryWrites=true&w=majority',
    secret: process.env.SECRET
}

module.exports = { settings }

