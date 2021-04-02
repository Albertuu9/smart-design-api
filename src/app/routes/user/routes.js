// middlewares
const loginMiddlewares = require('../../middlewares/login/middlewares')
// controller
const usersController = require('../../controllers/usersController/index')

module.exports = (function() {
    'use strict';
    var userRoutes = require('express').Router();

    userRoutes.post('/getUserDataById', loginMiddlewares.validateToken, usersController.getUserById);

    return userRoutes;
})();