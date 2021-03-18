const jwt = require('jsonwebtoken')
const platform = require('../../settings/settings')
// models
const User = require('../../models/user');
// utils
const utilDate = require('../../util/utilDate')
// shared
const generic = require('../../shared/generic')

function validateToken(req, res, next) {
  const token = req.headers['access-token'];

  if (token) {
    jwt.verify(token, platform.settings.secret, (err, decoded) => {
      if (err) {
        return res.json({ message: 'token not valid' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json({ code: 500 })
  }
}

function checkUserExists(req, res, next) {
  let email = '';
  let method = null;
  if(req.user) {
    email = req.user._json.email ? req.user._json.email : req.user._json.login;
    method = 'socialLogin'
  } else {
    email = req.body.email;
  }

  User.find({ email: email }).then((user) => {
    if (user && user.length > 0) {
      const userObject = user[0]
      User.findByIdAndUpdate(userObject._id, { 'lastUpdate': utilDate.getCurrentDate() }, ((error, result) => {
        const token = generic.generateToken();
        if (error) {
          res.json({ 'code': 500, message: error });
        } else {
          let userLogged = {
            id: userObject._id
        }
        if(method) {
          //dev uri
          // res.redirect(process.env.DEV_URL + '/#/socialLogin?id='+userLogged.id+'&token='+token);
          // prod uri
          res.redirect(process.env.PROD_URL + '/#/socialLogin?id='+userLogged.id+'&token='+token);
        } else {
          res.json({ 'code': 200, message: 'user updated success', user: userLogged.id, token: token });
        }
          
        }
      }))
    } else {
      console.log('el usuario no existe, por lo tanto, va a crearse uno nuevo');
      next();
    }
  })
}

module.exports = { validateToken, checkUserExists }