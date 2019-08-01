require('dotenv').config()
var request = require('request')
var user = require('./users/users')
var fs = require('fs')

module.exports = (req, res) => {
    if (req.query.token != undefined) {
        request("https://serverless-auth.brunoeleodoro.now.sh?type=verify&token=" + req.query.token, async function (error, response, body) {
            console.log(body)
            if (error) {
                error_response(res);
            } else if (JSON.parse(body).valid != undefined && JSON.parse(body).valid == false) {
                error_response(res);
            } else {

                if (req.body.route != undefined && req.body.route == "") {
                    res.json({
                        status: 201,
                        message: 'no route provided'
                    });
                } else if (req.body.route == "/user/listAllUsers") {
                    res.json({
                        status: 200,
                        response: await user.listAllUsers({})
                    })
                } 
                else if (req.body.route == "/user/updateUser") {
                    if(await user.update(req.body.id, req.body.body)) {
                        res.json({
                            status: 200,
                            response: req.body.body
                        })
                    } else {
                        failure(res)
                    }
                } else {
                    res.json({
                        status: 202,
                        message: 'nothing to do'
                    });
                }

            }
        });
    }
    else {
        basicMethods(req, res)
    }
}

async function basicMethods(req, res) {
    //authenticate method
    if (req.body != undefined && req.body.route != undefined && req.body.route == "/user/authenticate") {
        if (await user.authenticate(req.body.email, req.body.password)) {
            success(res);
        } else {
            failure(res);
        }
    } else if (req.body.route != undefined && req.body.route == "/user/signup") {

        if (await user.signup(req.body.body)) {
            request("https://serverless-auth.brunoeleodoro.now.sh?type=generate&email=" + req.body.body.email, async function (error, response, body) {
                if (error) {
                    error_response(res);
                } else {
                    res.json({
                        token: JSON.parse(body).token
                    })
                }
            });

        } else {
            failure(res);
        }
    } else {
        res.json({
            alive: true
        })
    }
}

function success(res) {
    res.json({
        status: 200,
        success: true
    });
}
function failure(res) {
    res.json({
        status: 201,
        success: false
    });
}
function error_response(res) {
    res.json({
        error: true
    })
}