// middlewares
const loginMiddlewares = require('../../middlewares/login/middlewares')
// controller
const avatarsController = require('../../controllers/avatarsController/index')

module.exports = (function() {
    'use strict';
    var avatarRoutes = require('express').Router();

    avatarRoutes.post('/loadAvatars', loginMiddlewares.validateToken, avatarsController.loadAvatars);

    return avatarRoutes;
})();