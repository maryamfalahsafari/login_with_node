var express = require('express');
var app = express();
var morgan = require('morgan');
var jwt = require('jsonwebtoken');

app.use(morgan('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test', function (req, res) {

    return res.json({ name: 'Maryam' });

});
app.post('/login', function (req, res) {
    var userName = req.body.userName;
    var password = req.body.password;
    if (userName == "Maryam" && password == "123456") {
        var token = jwt.sign({ userName: userName }, 'secretKey', { expiresIn: '1h' });
        return res.send(token);
    }
});

app.use(function (req, res, next) {
    var token = req.body.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'secretKey', function (err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Invalid token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        res.json({ success: false, message: 'Token not provided' });
    }
});

app.post('/me', function (req, res) {
    res.send(req.decoded);
});

app.listen(3000, function () {
    console.log('Run at port 3000');
});

