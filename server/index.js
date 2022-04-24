'use strict'
global.fetch = require("node-fetch")
const express = require("express")
const request = require("request")
const cors = require("cors")
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser")
const snoowrap = require("snoowrap");
const { toJson, Subreddit } = require("snoowrap");

const app = express()
const port = process.env.PORT || 5500;

global.fetch = fetch;
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use("/data", require('./routes/user'))
app.use("/feed", require('./routes/feed'))
app.use("/subreddit", require('./routes/subreddit'))
app.use("/search", require('./routes/search'))
app.use("/action", require('./routes/action'))

app.get("/reddit", (req, res) => {
    var authenticationUrl = snoowrap.getAuthUrl({
        clientId: process.env.clientId,
        scope: ['read', 'mysubreddits', 'identity', 'subscribe', 'vote', 'save', 'submit', 'history', 'edit', 'flair', 'privatemessages', 'report'],
        redirectUri: process.env.redirectUri,
        permanent: true,
        state: '0325534f38b78c1dbd'
    });

    res.redirect(authenticationUrl);
}) 

app.post('/login', async (req, res) => {
    const code = req.body.code;

    await snoowrap.fromAuthCode({
        code: code,
        userAgent: process.env.userAgent,
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret,
        redirectUri: process.env.redirectUri,
    })
    .then((response) => {
        const access_token = response.accessToken;
        const refresh_token = response.refreshToken;
        const expires_in = 3600;
        const data = { access_token, refresh_token, expires_in };
        res.status(200).send(data)
    })
    .catch(err => {
        console.log("Login Error:", err)
        res.sendStatus(400)
    });
});

app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    console.log("Refresh Token:", refreshToken)

    snoowrap.prototype.credentialedClientRequest.call({
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret,
        userAgent: process.env.userAgent,
    }, {
        method: 'POST',
        baseUrl: 'https://www.reddit.com',
        uri: 'api/v1/access_token',
        form: {grant_type: 'refresh_token', refresh_token: refreshToken}
    })
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => {
        console.log("Refresh Error:", err)
        res.sendStatus(400)
    })
});

app.get("/logout", (req, res) => {
    res.redirect(process.env.redirectUri)
});

app.listen(port, () => {
    console.log(`Lift off! Server is running on PORT: ${port}`)
});
