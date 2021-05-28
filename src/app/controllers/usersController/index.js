// api
const UserApi = require('../../api/User');
// utils
const utilDate = require('../../util/utilDate');
// models
const User = require('../../models/user');

function getUserById(req, res){
    UserApi.getUserById(req.body.id).then((user) => {
        res.json({ 'code': 200, 'user': user })
    }).catch((error) => {
        res.json({ 'code': 500, 'message': error })
    });
}

function updateUserInfo(req, res){
    UserApi.checkMailExists(req.body.email).then((user) => {
        if(user && user[0]._id.toString() !== req.body.id){
            res.json({ 'code': 409, 'message': 'email exists' })
        } else {
            User.findByIdAndUpdate(req.body.id, { 'name': req.body.name, 'surname': req.body.surname, 'email': req.body.email, 'country': req.body.country, 'userType': req.body.userType, 'lastUpdate': utilDate.getCurrentDate() }, ((error, result) => {
                if (error) {
                    res.json({ 'code': 500 });
                } else {
                    // obtenemos el usuario actualizado
                    UserApi.getUserById(req.body.id).then((user) => {
                        res.json({ 'code': 200, 'user': user })
                    }).catch((error) => {
                        res.json({ 'code': 500, 'message': error })
                    });
                }
        
            }))
        }
    })
}

module.exports = { getUserById, updateUserInfo }