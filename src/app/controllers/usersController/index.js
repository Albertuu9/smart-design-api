// api
const UserApi = require('../../api/User');

function getUserById(req, res){
    let id = req.body.id;
    UserApi.getUserById(id).then((user) => {
        res.json({ 'code': 200, 'user': user })
    }).catch((error) => {
        res.json({ 'code': 500, 'message': error })
    });
}

module.exports = { getUserById }