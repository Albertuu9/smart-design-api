// controllers
const loginController = require('../../controllers/loginController/index')

module.exports = (function() {
    'use strict';
    var loginRoutes = require('express').Router();

    loginRoutes.post('/login', loginController.checkUserExists);

    loginRoutes.post('/saveNewUser', loginController.saveNewUser);

    loginRoutes.post('/sendRecoverPasswordCode', loginController.sendRecoverPasswordCode);

    loginRoutes.post('/checkCodeExists', loginController.checkCodeExists);

    loginRoutes.post('/changePassword', loginController.updatePassword);

    loginRoutes.post('/checkMail', loginController.checkMailExists);

    return loginRoutes;
})();