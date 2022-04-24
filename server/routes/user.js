const router = require('express').Router()
const axios = require("axios"); 

router.post("/profile", async (req, res) => {
    const token = req.body.token;

    try {
        axios.get("https://oauth.reddit.com/api/v1/me", {
            headers: {
                'User-Agent': 'Telepath',
                'Accept': 'application/json',
                'Authorization': 'bearer ' + token,
            }
        })
        .then((data) => {
            console.log(`Logged in as ${data.data.name}...`)
            res.status(200).send(data.data)
        })

    } catch (error) {
        console.log(error)
    }
})

router.post("/user", async (req, res) => {
    const token = req.body.token;
    const user = req.body.user;

    if (!token) {
        try {
            axios.get(`https://api.reddit.com/user/${user}/about`)
            .then((data) => {
                res.status(200).send(data.data.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    if (token) {
        try {
            axios.get(`https://oauth.reddit.com/user/${user}/about`, {
                headers: {
                    'User-Agent': 'Telepath',
                    'Accept': 'application/json',
                    'Authorization': 'bearer ' + token,
                }
            })
                .then((data) => {
                    res.status(200).send(data.data.data)
                })
        } catch (error) {
            console.log(error)
        }
    }
});

router.post("/feed", async (req, res) => {
    const { user, token } = req.body;

    if (!token) {
        try {
            const response = await fetch(`https://api.reddit.com/user/${user}/submitted/hot?limit=100`, {
                method: 'GET'
            })
            const data = await response.json()
            const posts = data.data.children.map(data => data.data);

            res.status(200).send({
                posts: posts,
                after: data.data.after ? data.data.after : null
            })

        }
        catch (error) {
            console.log(error)
        }
    }

    if (token) {
        try {
            const response = await fetch(`https://oauth.reddit.com/user/${user}/submitted/hot?limit=125`, {
                headers: {
                    'User-Agent': 'Telepath',
                    'Accept': 'application/json',
                    'Authorization': 'bearer ' + token,
                }
            })
            const data = await response.json()
            const posts = data.data.children.map(data => data.data);

            res.status(200).send({
                posts: posts,
                after: data.data.after ? data.data.after : null
            })

        } catch (error) {
            console.log(error)
        }
    }
});

module.exports = router;