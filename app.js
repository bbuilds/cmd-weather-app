const yargs = require('yargs');
const axios = require('axios');

//stores final parsed output
const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        },
        c: {
            demand: false,
            alias: 'format',
            describe: 'format C for Celcius. Defaults to Farhenheit.',
            string: true
        }
    })
    .help()
    .argv;

const weatherAPiKey = 'ENTER_YOUR_API_KEY';
const endcodedAddress = encodeURIComponent(argv.address);
const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${endcodedAddress}`;
const convertCelcius = argv.c;

axios.get(geocodeUrl).then((response) => {
    if(response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find that address');
    }
    const lat = response.data.results[0].geometry.location.lat;
    const long = response.data.results[0].geometry.location.lng;
    const weatherUrl = `https://api.darksky.net/forecast/${weatherAPiKey}/${lat},${long}`;

    console.log(response.data.results[0].formatted_address);

    return axios.get(weatherUrl);  

})
.then((response) => {
    const temp = response.data.currently.temperature;
    const apprantTemp = response.data.currently.apparentTemperature;
    const celciusTemp = Math.round(((response.data.currently.temperature - 32) / 9) * 5, 2);
    const celciusApprantTemp = Math.round(((response.data.currently.apparentTemperature - 32) / 9) * 5, 2);

    if (convertCelcius) {
        console.log(`The temp says ${celciusTemp} outside but it feels like ${celciusApprantTemp}`);
    } else {
        console.log(`The temp says ${temp} outside but it feels like ${apprantTemp}`);
    }
})
.catch((e) => {
    if (e.code === 'ENOTFOUND') {
      console.log('Unable to connect to API servers.');
    } else {
      console.log(e.message);
    }  
})