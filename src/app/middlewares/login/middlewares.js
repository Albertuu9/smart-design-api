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
  User.find({ email: req.body.email }).then((user) => {
    if (user && user.length > 0) {
      User.findByIdAndUpdate(user[0]._id, { 'lastUpdate': utilDate.getCurrentDate() }, ((error, result) => {
        const token = generic.generateToken();
        if (error) {
          res.json({ 'code': 500, message: error });
        } else {
          res.json({ 'code': 200, message: 'user updated success', user: user[0], token: token });
        }
      }))
    } else {
      console.log('el usuario no existe, por lo tanto, va a crearse uno nuevo');
      next();
    }
  })
}

module.exports = { validateToken, checkUserExists }