const Avatar = require('../../models/avatar');

function loadAvatars(req, res){
    Avatar.find({},{creationDate: 0, lastUpdate: 0}).then((avatars) => {
        let payload = {
            standardAvatars: avatars.filter((avatar) => avatar.type === "standard"),
            premiumAvatars: avatars.filter((avatar) => avatar.type === "premium")
        }
        res.json({'code': 200, data: payload});
    }).catch((error) => {
        res.json({ 'code': 500 })
    })
}

module.exports = { loadAvatars }