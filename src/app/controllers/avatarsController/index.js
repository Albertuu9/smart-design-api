const Avatar = require('../../models/avatar');

function loadAvatars(req, res){
    Avatar.find().then((avatars) => {
        res.json({data: avatars});
    })
}

module.exports = { loadAvatars }