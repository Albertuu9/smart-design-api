const jwt = require('jsonwebtoken')
const platform = require('./../../settings/settings')
const crypto = require('crypto')
const generatePassword = require('password-generator');
const geoip = require('geoip-lite');
const axios = require('axios');
// utils
const utilDate = require('../../util/utilDate')
const utilPassword = require('../../util/utilPassword')
// api
const UserApi = require('../../api/User');
// models
const User = require('../../models/user');
// controllers
const mailController = require('../mailController/index');
// shared
const generic = require('../../shared/generic');
// templates
const mailTemplate = require('./../../templates/mail/index')

function checkUserExists(req, res) {
    User.find({ email: req.body.email }, { creationDate: 0, lastUpdate: 0 }).then((user) => {
        utilPassword.decryptPassword(req.body.password, user[0].password).then((userExists) => {
            if (userExists) {
                const token = generic.generateToken();
                let userResponse = {
                    id: user[0]._id
                }
                res.json({ 'code': 200, token: token, user: userResponse.id })
            } else {
                res.json({ 'code': 500 })
            }
        }).catch((error) => {
            res.json({ 'code': 500, message: error })
        })
    }).catch((error) => {
        res.json({ 'code': 500, message: error })
    })
}

function loginGoogle(req, res) {
    User.find({ email: req.body.email }, { creationDate: 0, lastUpdate: 0, settings: 0 }).then((user) => {
        if (user && user.length > 0) {
            const token = generic.generateToken();
            res.json({ 'code': 200, token: token, user: user[0] })
        } else {
            res.json({ 'code': 500 })
        }
    }).catch((error) => {
        res.json({ 'code': 500, message: error })
    })
}

function loginGuest(req, res) {
    const token = generic.generateToken();
    let hash = generateGuestHash()
    let user = {
        _id: hash,
        name: 'Invitado',
        isPremium: false,
        avatar: generateRandomAvatar()
    }
    res.json({ 'code': 200, token: token, user: user })
}

function checkCodeExists(req, res) {
    console.log('req', req.body);
    User.find({ _id: req.body.id }).then((user) => {
        if (user && user.length > 0) {
            if (parseInt(req.body.code) === user[0].settings.verificationCode) {
                res.json({ 'code': 200 })
            } else {
                res.json({ 'code': 500 })
            }
        } else {
            res.json({ 'code': 500 })
        }
    });
}

function checkMailExists(req, res) {
    User.find({ email: req.body.email }).then((user) => {
        if (user && user.length > 0) {
            let payload = {
                id: user[0]._id,
                email: user[0].email
            }
            res.json({ 'code': 200, 'user': payload })
        } else {
            res.json({ 'code': 500 })
        }
    })
}

function checkTokenIsValid(req, res) {
    const token = req.body.token

    if (token) {
        jwt.verify(token, platform.settings.secret, (err, decoded) => {
            if (err) {
                res.json({ code: 400, message: 'token not valid' });
            } else {
                req.decoded = decoded;
                res.json({ code: 200, decoded: decoded });
            }
        });
    } else {
        res.json({ code: 500, message: 'token doesn\'t exists' })
    }
}

function updatePassword(req, res) {
    const newPassword = req.body.password
    let promises = []
    let cryptedPassword = ''

    promises.push(utilPassword.encryptPassword(newPassword).then((hashedPassword) => {
        cryptedPassword = hashedPassword
    }))

    Promise.all(promises).then(() => {
        User.findByIdAndUpdate(req.body.id, { 'password': cryptedPassword, 'lastUpdate': utilDate.getCurrentDate() }, ((error, result) => {
            if (error) {
                res.json({ 'code': 500 })
            } else {
                console.log('result', result);
                res.json({ 'code': 200 })
            }
        }))
    })
}

function sendRecoverPasswordCode(req, res) {
    User.find({ email: req.body.email }).then((user) => {
        if (user && user.length > 0) {
            const code = generateCode();
            updateUserSettings(user[0], code, res);
            // mail object
            const mail = {
                subject: 'Código de verificación',
                body: mailTemplate.sendCodeTemplate(code)
            }
            mailController.sendMail(user[0], mail, res)
        } else {
            res.json({ 'code': 500 })
        }
    })
}

function updateUserSettings(user, code, res) {
    const settings = {
        verificationCode: code
    }
    User.findByIdAndUpdate(user._id, { 'settings': settings, 'lastUpdate': utilDate.getCurrentDate() }, ((error, result) => {
        if (error) {
            res.json({ 'code': 500 });
        } else {
            res.json({ 'code': 200 });
        }

    }))
}

function saveNewUser(req, res, method = null) {
    let promises = []
    const name = req.body.name
    const surname = req.body.surname
    const country = req.body.country
    const email = req.body.email
    const password = req.body.method === 'google' || 'github' ? generateRandomPassword() : req.body.password
    const avatar = req.body.method === 'google' || 'github' ? generateRandomAvatar() : req.body.avatar
    const userType = req.body.method === 'google' || 'github' ? 'Particular' : req.body.userType
    const isPremium = false
    const role = 1;
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
            role,
            creationDate,
            lastUpdate
        });

        user.save().then((result) => {
            const token = generic.generateToken();
            user.passwordShowed = password
            // mail object
            const mail = {
                subject: 'Usuario registrado correctamente',
                body: mailTemplate.userRegisteredTemplate(user)
            }
            mailController.sendMail(user, mail, res)

            let userLogged = {
                id: user._id
            }

            if(method) {
                //dev uri
                // res.redirect(process.env.DEV_URL + '/#/socialLogin?id='+userLogged.id+'&token='+token);
                // prod uri
                res.redirect(process.env.PROD_URL + '/#/socialLogin?id='+userLogged.id+'&token='+token);
            } else {
                res.json({ code: 200, user: userLogged.id, token: token })
            }
            
        }).catch((error) => {
            res.json({ code: 400, message: error })
        })
    })

}

function checkUserById(req, res){
    let id = req.body.id;
    UserApi.getUserById(id).then((user) => {
        res.json({ 'code': 200, 'user': user })
    }).catch((error) => {
        res.json({ 'code': 500, 'message': error })
    });
}

function getUserCountryByIp(req, res) {
    let geo = geoip.lookup(req.body.ip)
    if (geo) {
        res.json({ code: 200, data: geo })
    } else {
        res.json({ code: 500 })
    }
}

function generateCode() {
    let code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return code
}

function generateRandomAvatar() {
    let avatars = ['https://i.ibb.co/fQWWKmt/guest1.png',
        'https://i.ibb.co/bX6RRts/guest2.png',
        'https://i.ibb.co/DVCzFyR/guest3.png',
        'https://i.ibb.co/svSXp9K/guest4.png',
        'https://i.ibb.co/ww8dQqQ/guest5.png',
        'https://i.ibb.co/XxMyTMm/guest6.png',
        'https://i.ibb.co/Gkf0xT9/guest7.png',
        'https://i.ibb.co/5FcJQ21/guest8.png']
    let random = Math.floor(Math.random() * (avatars.length - 0));
    return avatars[random];

}

function generateGuestHash() {
    let current_date = (new Date()).valueOf().toString()
    let random = Math.random().toString()
    let result = crypto.createHash('sha1').update(current_date + random).digest('hex')
    return result
}


// github connection
function getError(req, res) {
    res.json({ 'code': 500, 'message': 'error' });
}

function authSocialLogin(req, res) {
    getIp().then((response) => {
        let geo = geoip.lookup(response.data.ip);
        let user = req.user._json;
        req.body.country = geo.country;
        req.body.name = user.name;
        req.body.email = user.email ? user.email : user.login;
    
        saveNewUser(req, res, 'socialLogin');
    })
}

function getIp(req, res) {
    return axios.get('https://api.ipify.org/?format=json')
}

function generateRandomPassword() {
    return generatePassword();
}

module.exports = {
    checkUserExists,
    saveNewUser,
    sendRecoverPasswordCode,
    checkCodeExists,
    updatePassword,
    checkMailExists,
    loginGuest,
    checkTokenIsValid,
    loginGoogle,
    getUserCountryByIp,
    getError,
    authSocialLogin,
    getIp,
    checkUserById
}