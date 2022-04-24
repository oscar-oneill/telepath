const router = require('express').Router()

// Action routes can only be targeted if the user is authenticated

router.post("/vote", async (req, res) => {
    const { token, dir, id } = req.body
    try {
        const response = await fetch("https://oauth.reddit.com/api/vote", {
            method: "POST",
            headers: {
                'User-Agent': 'Telepath',
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': 'bearer ' + token,
            },
            body: `dir=${dir}&id=t3_${id}&rank=2`,

        }) 

        const data = await response.json()

        if (data.length === undefined || null) {
            const response = await fetch(`https://oauth.reddit.com/comments/${id}/`, {
                methond: "GET",
                headers: {
                    'User-Agent': 'Telepath',
                    "Content-Type": "application/json",
                    'Authorization': 'bearer ' + token,
                },
            })
            const data = await response.json()
            res.status(200).send(data[0].data.children[0].data)
        }

    } catch (error) {
        console.log(error.stack) 
    }
})


// Use appropriate type prefixes after comments are implemented the design
// For now the "t3" post/link prefix is hardcoded to the body
router.post("/save", async (req, res) => {
    const { token, id } = req.body

    try {
        const response = await fetch("https://oauth.reddit.com/api/save", {
            method: "POST",
            headers: {
                'User-Agent': 'Telepath',
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': 'bearer ' + token,
            },
            body: `id=t3_${id}`
        })
        const data = await response.json()

        if (data.length === undefined || null) {
            const response = await fetch(`https://oauth.reddit.com/comments/${id}/`, {
                methond: "GET",
                headers: {
                    'User-Agent': 'Telepath',
                    "Content-Type": "application/json",
                    'Authorization': 'bearer ' + token,
                },
            })
            const data = await response.json()
            res.status(200).send(data[0].data.children[0].data)
        }

    } catch (error) {
        console.log(error.stack)
    }
})

router.post("/unsave", async (req, res) => {
    const { token, id } = req.body;

    try {
        const response = await fetch("https://oauth.reddit.com/api/unsave", {
            method: "POST",
            headers: {
                'User-Agent': 'Telepath',
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': 'bearer ' + token,
            },
            body: `id=t3_${id}`
        })
        const data = await response.json()

        if (data.length === undefined || null) {
            const response = await fetch(`https://oauth.reddit.com/comments/${id}/`, {
                methond: "GET",
                headers: {
                    'User-Agent': 'Telepath',
                    "Content-Type": "application/json",
                    'Authorization': 'bearer ' + token,
                }, 
            })

            const data = await response.json()
            res.status(200).send(data[0].data.children[0].data)
        }

    } catch (error) {
        console.log(error.stack)
    }
})

module.exports = router