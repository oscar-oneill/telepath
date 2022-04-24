const router = require('express').Router()
const dotenv = require("dotenv").config()
const otherRequester = require("../utilities/index")
const { toJson, Subreddit } = require("snoowrap");

router.post("/autocomplete", async (req, res) => {
    const { token, search, over18 } = req.body;

    if (!token) {
        try {
            await otherRequester.oauthRequest({uri: `/api/subreddit_autocomplete?query=${search}&include_over_18=false&include_profiles=true`, method: 'get'})
            .then(data => {
                res.status(200).json(data);
            })
            .catch((err) => {
                console.log(err);
            })

        } catch (error) {
            console.log(error)
        }
    }

    if (token) {
        try {
            const response = await fetch(`https://oauth.reddit.com/api/subreddit_autocomplete?query=${search}&include_over_18=${over18}&include_profiles=true`, {
                method: "GET",
                headers: {
                    'User-Agent': 'Telepath',
                    'Accept': 'application/json',
                    'Authorization': 'bearer ' + token,
                },
            }) 

            const data = await response.json()
            res.status(200).json(data)

        } catch (error) {
            console.log(error)
        }
    }
})

module.exports = router;