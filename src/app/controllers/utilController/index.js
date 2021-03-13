const axios = require('axios');

function getCountries(req, res){
    return axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
        if(response) {
            let countries = [];
            response.data.forEach((element, index) => {
                countries[index] = {name: element.name, alpha2Code: element.alpha2Code, flag: element.flag}
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