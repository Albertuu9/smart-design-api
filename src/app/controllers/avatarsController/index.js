const Avatar = require('../../models/avatar');

function loadAvatars(req, res){
    Avatar.find({},{creationDate: 0, lastUpdate: 0}).then((avatars) => {
        res.json({'code': 200, data: avatars});
    }).catch((error) => {
        res.json({ 'code': 500 })
    })
}

module.exports = { loadAvatars }