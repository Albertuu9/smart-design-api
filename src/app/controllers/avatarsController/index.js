const Avatar = require('../../models/avatar');

function loadAvatars(req, res){
    Avatar.find({},{creationDate: 0, lastUpdate: 0}).then((avatars) => {
        res.json({data: avatars});
    })
}

module.exports = { loadAvatars }