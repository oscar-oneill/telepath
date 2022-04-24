const router = require("express").Router()
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser")
const otherRequester = require("../utilities/index")
const axios = require("axios")

let arr = []

router.post("/about", async (req, res) => {
    const { subreddit, token } = req.body

    if (!token) {
        try {
            axios.get(`https://api.reddit.com/r/${subreddit}/about`)
            .then((data) => {
                res.status(200).send(data.data.data)
            })
        } catch (error) {
            console.log(error)
        }
    } 
    
    if (token) {
        try {
            axios.get(`https://oauth.reddit.com/r/${subreddit}/about`, {
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

router.post("/subscribe", async (req, res) => {
    const { token, subredditID, subreddit, origin } = req.body;

    try {
        const response = await fetch("https://oauth.reddit.com/api/subscribe", {
            method: 'POST',
            headers: {
                Authorization: 'bearer ' + token,
                "Content-Type": "application/x-www-form-urlencoded",
                skip_initial_defaults: "1",
            },
            body: `action=sub&sr=${subredditID}`,
        }) 
        const data = await response.json()
        console.log("Subscribed:", data.length)

        if (data.length === undefined || null) {
            if (origin === "subreddit") {
                axios.get(`https://oauth.reddit.com/r/${subreddit}/about`, {
                    headers: {
                        'User-Agent': 'Telepath',
                        'Accept': 'application/json',
                        'Authorization': 'bearer ' + token,
                    }
                })
                .then((val) => {
                    res.status(200).send(val.data.data.user_is_subscriber);
                })
            } else {
                axios.get(`https://oauth.reddit.com/user/${subreddit}/about`, {
                    headers: {
                        'User-Agent': 'Telepath',
                        'Accept': 'application/json',
                        'Authorization': 'bearer ' + token,
                    }
                })
                .then((val) => {
                    res.status(200).send(val.data.data.subreddit.user_is_subscriber);
                })
            }
        }

    } catch (error) {
        console.log("Problem subscribing...")
        console.log(error.stack)
    }
})

router.post("/unsubscribe", async (req, res) => {
    const { token, subredditID, subreddit, origin } = req.body;

    try {
        const response = await fetch("https://oauth.reddit.com/api/subscribe", {
            method: 'POST',
            headers: {
                Authorization: 'bearer ' + token,
                "Content-Type": "application/x-www-form-urlencoded",
                skip_initial_defaults: "1",
            },
            body: `action=unsub&sr=${subredditID}`,
        })
        const data = await response.json()
        console.log("Unsubscribed:", data.length)

        if (data.length === undefined || null) {
            if (origin === "subreddit") {
                axios.get(`https://oauth.reddit.com/r/${subreddit}/about`, {
                    headers: {
                        'User-Agent': 'Telepath',
                        'Accept': 'application/json',
                        'Authorization': 'bearer ' + token,
                    }
                })
                .then((val) => {
                    res.status(200).send(val.data.data.user_is_subscriber);
                })
            } else {
                axios.get(`https://oauth.reddit.com/user/${subreddit}/about`, {
                    headers: {
                        'User-Agent': 'Telepath',
                        'Accept': 'application/json',
                        'Authorization': 'bearer ' + token,
                    }
                })
                .then((val) => {
                    res.status(200).send(val.data.data.subreddit.user_is_subscriber);
                })
            }
        }

    } catch (error) {
        console.log("Problem unsubscribing...")
        console.log(error.stack)
    }
})

router.post("/feed", async (req, res) => {
    const { subreddit, token } = req.body;

    if (!token) {
        try {
            const response = await fetch(`https://api.reddit.com/r/${subreddit}/hot?limit=125`, {
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
            const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot?limit=125`, {
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

router.post("/fetch", async (req, res) => {
    const { subreddit, token, after } = req.body
    console.log(req.body)


    if (!token) {
        try {
            const response = await fetch(`https://api.reddit.com/r/${subreddit}/hot?&after=${after}&limit=15`, {
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
            const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot?&after=${after}&limit=15`, {
                headers: {
                    'User-Agent': 'Telepath',
                    'Accept': 'application/json',
                    'Authorization': 'bearer ' + token,
                } 
            })

            const data = await response.json()
            const posts = data.data.children.map(data => data.data);
            if (data !== null || undefined) {
                console.log("More posts fetched successfully")
            }
            res.status(200).send({
                posts: posts,
                after: data.data.after ? data.data.after : null
            })
            
        } catch (error) {
            console.log(error)
        }
    }

})


module.exports = router