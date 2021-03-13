// controllers
const utilController = require('../../controllers/utilController/index')
// router
const utilRoutes = require('express').Router();

module.exports = (function() {
    'use strict';

    utilRoutes.get('/getCountries', utilController.getCountries);

    return utilRoutes;

})();