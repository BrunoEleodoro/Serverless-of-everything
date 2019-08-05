require('dotenv').config()
var express = require('express');
var app = express();
var request = require('request')
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const utils = require('./utils');

var auth_url = "https://serverless-auth.brunoeleodoro.now.sh";
var database_url = "https://serverless-database.brunoeleodoro.now.sh";
var mail_url = "https://serverless-mail.brunoeleodoro.now.sh";
var storage_url = "https://serverless-storage.brunoeleodoro.now.sh";

var port = process.env.PORT || 3001;
app.use(express.json());
app.get('/', (req, res) => {
    res.json({
        alive: true
    })
});

app.post('/user/authenticate', (req, res) => {
    request.post({
        headers: { 'content-type': 'application/json' },
        url: database_url,
        body: JSON.stringify({
            route: "/user/authenticate",
            email: req.body.email,
            password: req.body.password
        })
    }, function (error, response, body) {
        if (error) {
            utils.error_response(res)
            return;
        }
        res.json(JSON.parse(body))
    });
});

app.post("/user/signup", (req, res) => {
    request.post({
        headers: { 'content-type': 'application/json' },
        url: database_url,
        body: JSON.stringify({
            route: "/user/signup",
            body: req.body
        })
    }, function (error, response, body) {
        if (error) {
            utils.error_response(res)
            return;
        }
        res.json(JSON.parse(body))
    });
});

app.post("/user/listAllUsers", (req, res) => {
    if (req.headers.authorization != undefined) {
        var token = req.headers.authorization.split(" ")[1]
        request.post({
            headers: { 'content-type': 'application/json' },
            url: database_url + "?token=" + token,
            body: JSON.stringify({
                route: "/user/listAllUsers",
            })
        }, function (error, response, body) {
            if (error) {
                utils.error_response(res)
                return;
            }
            res.json(JSON.parse(body))
        });
    } else {
        utils.error_response(res)
    }

});


app.listen(port, function () {
    console.log('Running on port=' + 3000);
});
