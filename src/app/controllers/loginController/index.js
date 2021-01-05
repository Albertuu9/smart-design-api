const jwt = require('jsonwebtoken')
const platform = require('./../../settings/settings')
const crypto = require('crypto')
// utils
const utilDate = require('../../util/utilDate')
const utilPassword = require('../../util/utilPassword')
// models
const User = require('../../models/user');
// controllers
const mailController = require('../mailController/index')

function checkUserExists(req, res) {
    User.find({ email: req.body.email },{creationDate: 0, lastUpdate: 0}).then((user) => {
        utilPassword.decryptPassword(req.body.password, user[0].password).then((userExists) => {
            if (userExists) {
                const token = generateToken();
                let userResponse = {
                    _id: user[0]._id,
                    name: user[0].name,
                    surname: user[0].surname,
                    country: user[0].country,
                    email: user[0].email,
                    userType: user[0].userType,
                    isPremium: user[0].isPremium,
                    role: user[0].role
                }
                res.json({ 'code': 200, token: token, user: userResponse })
            } else {
                res.json({ 'code': 500})
            }
        }).catch((error) => {
            res.json({ 'code': 500, message: error })
        })
    }).catch((error) => {
        res.json({ 'code': 500, message: error })
    })
}

function loginGoogle(req, res) {
    User.find({ email: req.body.email },{creationDate: 0, lastUpdate: 0, password: 0}).then((user) => {
        if(user && user.length > 0) {
            const token = generateToken();
            res.json({ 'code': 200, token: token, user: user[0] })
        } else {
            res.json({ 'code': 500})
        }
    }).catch((error) => {
        res.json({ 'code': 500, message: error })
    })
}

function loginGuest(req, res) {
    const token = generateToken()
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
    if (req.body.code === req.session.code) {
        res.json({ 'code': 200 })
    } else {
        res.json({ 'code': 500 })
    }
}

function checkMailExists(req, res) {
    User.find({ email: req.body.email }).then((user) => {
        if (user && user.length === 0) {
            res.json({ 'code': 200 })
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
          res.json({code: 400, message: 'token not valid'});    
        } else {
          req.decoded = decoded;    
          res.json({code: 200, decoded: decoded});
        }
      });
    } else {
      res.json({code: 500, message: 'token doesn\'t exists'})
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
            res.json({ code: 200})
        }).catch((error) => {
            res.json({ code: 400, message: error })
        })
    })

}

function generateCode() {
    let code = Math.floor(Math.random() * (99999 - 10000)) + 10000;
    return code
}

function generateRandomAvatar(){
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

function generateGuestHash(){
    let current_date = (new Date()).valueOf().toString()
    let random = Math.random().toString()
    let result = crypto.createHash('sha1').update(current_date + random).digest('hex')
    return result
}

function generateToken() {
    const payload = {
        check: true
    };
    const token = jwt.sign(payload, platform.settings.secret, {
        expiresIn: '48h'
    });
    return token
}

module.exports = { checkUserExists, saveNewUser, sendRecoverPasswordCode, checkCodeExists, updatePassword, checkMailExists, loginGuest, checkTokenIsValid, loginGoogle }