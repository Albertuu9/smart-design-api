const passport = require('passport');
require('./../../auth/passport');
// middlewares
const LoginMiddleware = require('../../middlewares/login/middlewares')
// controllers
const loginController = require('../../controllers/loginController/index')
// router
const loginRoutes = require('express').Router();

module.exports = (function() {
    'use strict';

    loginRoutes.post('/login', loginController.checkUserExists);

    loginRoutes.post('/loginGoogle', loginController.loginGoogle);

    loginRoutes.post('/loginGuest', loginController.loginGuest);

    loginRoutes.post('/saveNewUser', LoginMiddleware.checkUserExists, loginController.saveNewUser);

    loginRoutes.post('/sendRecoverPasswordCode', loginController.sendRecoverPasswordCode);

    loginRoutes.post('/checkCodeExists', loginController.checkCodeExists);

    loginRoutes.post('/changePassword', loginController.updatePassword);

    loginRoutes.post('/checkMail', loginController.checkMailExists);

    loginRoutes.post('/checkToken', loginController.checkTokenIsValid);

    loginRoutes.post('/getUserCountryByIp', loginController.getUserCountryByIp);

    loginRoutes.get('/getIp', loginController.getIp);

    loginRoutes.post('/checkUserById', loginController.checkUserById);

    loginRoutes.post('/auth/error', loginController.getError);

    loginRoutes.get('/auth/github', passport.authenticate('github',{ scope: [ 'user:email' ] }));

    loginRoutes.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/auth/error' }), LoginMiddleware.checkUserExists, loginController.authSocialLogin);

    loginRoutes.get('/auth/google', passport.authenticate('google',{ scope: ['profile', 'email'] }));

    loginRoutes.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/error' }), LoginMiddleware.checkUserExists, loginController.authSocialLogin);

    return loginRoutes;
})();