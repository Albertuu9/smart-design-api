const axios = require('axios');

function getCountries(req, res){
    return axios.get('https://flagcdn.com/es/codes.json').then((response) => {
        if(response) {
            let countries = [];
            Object.keys(response.data).forEach(key => {
                console.log(response.data[key]);
                countries.push({name: response.data[key], alpha2Code: key, flag: 'https://flagcdn.com/32x24/'+key+'.png'});
            });
            res.json({code: 200, data: countries});
        } else {
            res.json({code: 500});
        }
    })
}

module.exports = {
    getCountries
}