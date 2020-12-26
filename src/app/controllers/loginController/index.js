const jwt = require('jsonwebtoken')
const platform = require('./../../settings/settings')
// utils
const utilDate = require('../../util/utilDate')
const utilPassword = require('../../util/utilPassword')
// models
const User = require('../../models/user');
// controllers
const mailController = require('../mailController/index')

function checkUserExists(req, res) {
    User.find({ email: req.body.email }).then((user) => {
        utilPassword.decryptPassword(req.body.password, user[0].password).then((userExists) => {
            if (userExists) {
                const token = generateToken();
                res.json({ 'code': 200, token: token, userHash: user[0]._id })
            } else {
                res.json({ 'code': 500 })
            }
        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => {
        console.log(error)
    })
}

function checkCodeExists(req, res) {
    if (req.body.code === req.session.code) {
        res.json({ 'code': 200 })
    } else {
        res.json({ 'code': 500 })
    }
}

function checkMailExists(req, res) {
    User.find({ email: req.body.email }).then((user) => {
        console.log(user);
        if (user && user.length > 0) {
            res.json({ 'code': 200 })
        } else {
            res.json({ 'code': 500 })
        }
    })
}

function updatePassword(req, res) {
    const newPassword = req.body.password
    let promises = []
    let cryptedPassword = ''

    promises.push(utilPassword.encryptPassword(newPassword).then((hashedPassword) => {
        cryptedPassword = hashedPassword
    }))

    Promise.all(promises).then(() => {
        User.findByIdAndUpdate(req.session.userId, { 'password': cryptedPassword, 'lastUpdate': utilDate.getCurrentDate() }, ((error, result) => {
            if (error) {
                res.json({ 'code': 500 })
            } else {
                console.log('result', result)
                res.json({ 'code': 200 })
            }
        }))
    })
}

function sendRecoverPasswordCode(req, res) {
    User.find({ email: req.body.email }).then((user) => {
        if (user && user.length > 0) {
            req.session.code = generateCode()
            req.session.userId = user[0]._id;
            mailController.sendMail(user[0], req.session.code, res)
        } else {
            res.json({ 'code': 500 })
        }
    })
}

function saveNewUser(req, res) {
    let promises = []
    const name = req.body.name
    const surname = req.body.surname
    const country = req.body.country
    const email = req.body.email
    const password = req.body.password
    const avatar = req.body.avatar
    const userType = req.body.userType
    const isPremium = false
    const creationDate = utilDate.getCurrentDate()
    const lastUpdate = utilDate.getCurrentDate()

    let cryptedPassword = ''

    promises.push(utilPassword.encryptPassword(password).then((hashedPassword) => {
        cryptedPassword = hashedPassword
    }))


    Promise.all(promises).then(() => {
        const user = new User({
            name,
            surname,
            country,
            email,
            password: cryptedPassword,
            avatar,
            userType,
            isPremium,
            creationDate,
            lastUpdate
        });

        user.updateOne().then((result) => {
            res.json({ code: 200, data: result })
        }).catch((error) => {
            res.json({ code: 400, message: error })
        })
    })

}

function generateCode() {
    let code = Math.floor(Math.random() * (99999 - 10000)) + 10000;
    return code
}

function generateToken() {
    const payload = {
        check: true
    };
    const token = jwt.sign(payload, platform.settings.secret, {
        expiresIn: 1440
    });
    return token
}

module.exports = { checkUserExists, saveNewUser, sendRecoverPasswordCode, checkCodeExists, updatePassword, checkMailExists }