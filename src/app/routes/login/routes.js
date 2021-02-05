// controllers
const loginController = require('../../controllers/loginController/index')
// router
const loginRoutes = require('express').Router();

module.exports = (function() {
    'use strict';

    loginRoutes.post('/login', loginController.checkUserExists);

    loginRoutes.post('/loginGoogle', loginController.loginGoogle);

    loginRoutes.post('/loginGuest', loginController.loginGuest);

    loginRoutes.post('/saveNewUser', loginController.saveNewUser);

    loginRoutes.post('/sendRecoverPasswordCode', loginController.sendRecoverPasswordCode);

    loginRoutes.post('/checkCodeExists', loginController.checkCodeExists);

    loginRoutes.post('/changePassword', loginController.updatePassword);

    loginRoutes.post('/checkMail', loginController.checkMailExists);

    loginRoutes.post('/checkToken', loginController.checkTokenIsValid);

    loginRoutes.post('/getUserIp', loginController.getUserIp);

    return loginRoutes;
})();