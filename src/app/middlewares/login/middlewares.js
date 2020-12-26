const jwt = require('jsonwebtoken')
const platform = require('../../settings/settings')

function validateToken(req, res, next) {
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, platform.settings.secret, (err, decoded) => {      
        if (err) {
          return res.json({ message: 'token not valid'});    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.json({code: 500})
    }
 }

 module.exports = { validateToken }