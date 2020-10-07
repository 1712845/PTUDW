const { request, response } = require('express');
var express = require('express');
var router = express.Router();
const axios = require('axios');
const moment = require('moment');

router.get("/", function(req,res){
  res.render("index",{
    weather: null,
    city: null,
    country: null,
    currTemp: null,
    tempLow: null,
    tempHigh: null,
    currWeather: null,
    currWind: null,
    currHumid: null,
    windShort: null,
    currPressure: null,
    currCloud: null,
    currCompass: null,
    currDegree: null,
    visibility: null,
    icon: null,
    code: null,
    time: null,
    sunrise: null,
    sunset: null});
});

router.post("/",function(req,res){
  
  let apiKey = '71fd62381a5ee04c1c335a3847e76818';
  let city = req.body.city;
  let url = 'https://api.openweathermap.org/data/2.5/weather?q='+ city + ' &appid='+ apiKey;

  axios.get(url).then(response => {
    console.log(response)
    if(response.status == 404){
      res.render("index");
    }
    else{
      let weather = response.data;
      let currentWeather = [];

      currentWeather['city'] =  weather.name;
      currentWeather['country'] = weather.sys.country;

      currentWeather['time'] = weather.dt;
      currentWeather['time'] = moment.unix(currentWeather['time']).format('DD-MM-YYYY HH:mm:ss');

      currentWeather['sunrise'] = weather.sys.sunrise;
      currentWeather['sunrise'] = moment.unix(currentWeather['sunrise']).format('HH:mm:ss');

      currentWeather['sunset'] = weather.sys.sunset;
      currentWeather['sunset'] = moment.unix(currentWeather['sunset']).format('HH:mm:ss');

      // K to C
      currentWeather['temperature'] = Math.round(weather.main.temp) - 273;
      currentWeather['highTemp'] = Math.round(weather.main.temp_max) - 273;
      currentWeather['lowTemp'] = Math.round(weather.main.temp_min) - 273;

      currentWeather['humidity'] = Math.round(weather.main.humidity);
      
      currentWeather['pressure'] = weather.main.pressure;
      // barometric pressure (converting hPa to inches)
      currentWeather['pressure'] = weather.main.pressure * 0.02961339710085;
      currentWeather['pressure']	= currentWeather['pressure'].toFixed(2);

      // Met
      currentWeather['visibility'] = weather.visibility;

      currentWeather['icon'] = "http://openweathermap.org/img/w/"+weather.weather[0].icon+".png";

      currentWeather['description'] = weather.weather[0].description;

      currentWeather['code'] = weather.weather[0].id;

      currentWeather['cloud'] = weather.clouds.all;

      currentWeather['windSpeed'] = weather.wind.speed;
      currentWeather['windDeg'] = weather.wind.deg;

      currentWeather['windCompass'] = Math.round((currentWeather['windDeg'] -11.25) / 22.5);


      let windNames = new Array("North","North Northeast","Northeast","East Northeast","East","East Southeast",
                                "Southeast", "South Southeast","South","South Southwest","Southwest",
                                "West Southwest","West","West Northwest","Northwest","North Northwest");

      let windShortNames = new Array("N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW");
      
      currentWeather['windDrection'] = windNames[currentWeather['windCompass']];

      let breif = "Current weather: " + currentWeather['temperature'] + "\xB0 and " + currentWeather['description'];
      if(currentWeather['windSpeed'] > 0){
        breif += " with winds out of the "+ windShortNames[currentWeather['windCompass']]+" at "+currentWeather['windSpeed']+" miles per hour";
      }
      
      console.log(currentWeather);
      console.log(breif);
      res.render("index",{
        weather: breif,
        city: currentWeather['city'],
        country: currentWeather['country'] ,
        currTemp: currentWeather['temperature']+"\xB0",
        tempLow:  currentWeather['lowTemp']+"\xB0",
        tempHigh: currentWeather['highTemp']+"\xB0",
        currWeather: currentWeather['description'],
        currWind: currentWeather['windSpeed'],
        currHumid: currentWeather['humidity'],
        windShort: windShortNames[currentWeather['windCompass']],
        currPressure: currentWeather['pressure'],
        currCloud: currentWeather['cloud'],
        currCompass: currentWeather['windCompass'],
        currDegree: currentWeather['windDeg'],
        visibility: currentWeather['visibility'],
        icon: currentWeather['icon'],
        code: currentWeather['code'],
        time: currentWeather['time'],
        sunrise: currentWeather['sunrise'],
        sunset: currentWeather['sunset']
      });
    }
  });
});
module.exports = router;
