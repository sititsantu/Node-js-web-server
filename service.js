const express = require('express');
const hbs = require('hbs');
const string = require('string');
const request = require('request');
const bodyParser = require("body-parser");
const apiKey = 'e9c5cd97467e0dbe9920900aa3c09c05';

const fs =require('fs');

var app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req,res,next)=>{
  var now= new Date().toString();
  var log =`${now}: ${req.method} ${req.url} `; 
    console.log(log);
    fs.appendFile('service.log', log +'\n',(err)=>{
        if(err){
            console.log('unable to write file')   
        }
    });
    
    next();
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getcurrentYear', () => {
    return new Date().toDateString();
})

app.get('/about', function (req, res) {
    // res.send('inside about page')
    res.render('about.hbs', {
        pageTittle: 'About Page'
    });
})

app.get('/bad', function (req, res) {
    res.send('error page');
})

app.get('/temperature', function (req, res) {
    res.render('temperature.hbs');
})


app.post('/temperature', function (req, res) {
    var city = req.body.city;
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    request({ url }, (error, Response, body) => {
        if (error) {
            res.render('temperature', { weather: null, error: 'Error, please try again, City Not found' });
        } else {
            let weather = JSON.parse(body)
            
            if (weather.main == undefined) {
                weatherText = 'Error, please try again,City Not found';
                res.render("temperature", { weather: weatherText, error: null });
            }
            else {
                // console.log('else');
                var tempTxt = (`${weather.main.temp}` - 32) * 5 / 9;
                tempTxt = string(tempTxt).left(5);
                let weatherText = `It's ${tempTxt} degrees in ${weather.name}!`;
                res.render("temperature", { weather: weatherText, error: null });
                //  console.log(`It's ${tempTxt} degrees in ${weather.name}!`)

            }


        }
    })
    // console.log(`${city}`);
    // res.send('POST request to the homepage')
})


app.listen(3000, () => {
    console.log('server is up on port 3000');
});

// app.get('/', function (req, res) {
//   res.send({
//       name:'santosh Nayak',
//       age:30,
//       company:'Bpost',
//       like :['sports', 'Yoga'     ]

//   })
// })