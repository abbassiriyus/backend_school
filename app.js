require('dotenv').config()
var express = require('express');
var app = express();
var cors = require('cors')
const upload = require("express-fileupload")
const fs = require('fs')
const uuid = require("uuid");
var nodemailer = require('nodemailer');
const math = require('mathjs')
const PORT=process.env.PORT || 5000
app.use(cors())
app.use(upload())

const jwt = require('jsonwebtoken')
const TOKEN = '69c65fbc9aeea59efdd9d8e04133485a09ffd78a70aff5700ed1a4b3db52d33392d67f12c1'

function autificationToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, TOKEN, (err, user) => {
        if (err) res.sendStatus(403)
    })
    next()
}

// address
app.get('/address',(req,res)=>{
res.send("hello my freens")
})
app.get('/address/:id', (req, res) => {

})
app.post('/address', (req, res) => {

})
app.delete('/address/:id', (req, res) => {

})
app.put('/address/:id', (req, res) => {

})











app.listen(PORT, function () {
    console.log(`Listening to Port ${PORT}`);
});