//setup NodeJS and Express
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = 4200;

// helper function to build the API URL
function buildURL(enteredCity) {
    const values = [];
    const baseURL = 'https://api.openweathermap.org';
    const cityParameter = enteredCity;
    const apiKey = '47be6e0b8f9228a790c9c3d864e5445d';
    const temperatureFormat = 'metric';

    values.push(baseURL, cityParameter, apiKey, temperatureFormat);
    return values;
}

/**
 * Function used to get the temperature of the weatherData object
 * @param weatherData the API response object
 * @returns {number} the temperature
 */
function getTemperature(weatherData) {
    return Number(weatherData.main.temp);
}

/**
 * Function used to get the description of the weatherData object
 * @param weatherData the API response object
 * @returns {string} the description of the weather
 */
function getDescription(weatherData) {
    return weatherData.weather[0].description;
}

/**
 * Function used to get the iconCode of the weatherData object
 * @param weatherData weatherData the API response object
 * @returns {string} the icon code
 */
function getIconCode(weatherData) {
    return weatherData.weather[0].icon;
}

/**
 * Function used to get the image URL of the weatherData object
 * @param weatherData the API response object
 * @returns {string} the source URL for the image
 */
function getImageURL(weatherData) {
    return `http://openweathermap.org/img/wn/${getIconCode(weatherData)}@2x.png`;
}

// handle homepage
app.get('/', ((req, res) => {
    res.sendFile(__dirname + '/index.html');
}));

app.post('/', ((req, res) => {

    const URLValues = buildURL(req.body.cityName);
    const apiURL = `${URLValues[0]}/data/2.5/weather?q=${URLValues[1]}&appid=${URLValues[2]}&units=${URLValues[3]}`;

    https.get(apiURL, (response) => {
        console.log(response.statusCode);

        response.on('data', (data) => {
            /**
             * JSON.parse(); will take any given data (text,bytes etc.) and transform it into a JS object.
             * @type {any} returns an unspecified object type (any).
             */
            const weatherData = JSON.parse(data);

            res.write('<p>The weather is currently ' + getDescription(weatherData) + '</p>');
            res.write(`<h1>The temperature in ${URLValues[1]} is ${getTemperature(weatherData)} &#8451;</h1>`);
            res.write(`<img src="${getImageURL(weatherData)}" alt="The weather icon could not be displayed.">`);
            res.send();
        });
    });
}));


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

