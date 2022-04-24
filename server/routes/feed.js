const router = require("express").Router()
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser")
const otherRequester = require("../utilities/index")
const axios = require("axios")

router.post("/all", async (req, res) => {
    const token = req.body.token;
    console.log(`${token ? "Authenticated" : "Logged Out"}`)

    if (!token) {
        try {
            axios.get("https://api.reddit.com/r/all/hot?limit=100")
            .then((data) => {
                const posts = data.data.data.children.map(data => data.data);
                res.status(200).send({
                    posts: posts,
                    after: data.data.data.after ? data.data.data.after : null
                })
            })
            .catch((error) => {
                res.status(200).send(error)
            })

        } catch (error) {
            console.log(error)
            res.status(200).send(error)
        }
    } else {

        // If user is logged in, fetch the user's best posts from their frontpage
        try {
            axios.get("https://oauth.reddit.com/hot?limit=100", {
                headers: {
                    'User-Agent': 'Telepath',
                    'Accept': 'application/json',
                    'Authorization': 'bearer ' + token,
                }
            })
            .then((data) => {
                const posts = data.data.data.children.map(data => data.data);
                res.status(200).send({
                    posts: posts,
                    after: data.data.data.after ? data.data.data.after : null
                })
            })
            .catch((error) => {
                res.status(200).send(error)
            })

        } catch (error) {
            console.log(error)
            res.status(200).send(error)
        }
    }
});

module.exports = router