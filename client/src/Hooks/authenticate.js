import { useEffect, useState, useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import axios from 'axios'

const Authenticate = () => {
    const code = new URLSearchParams(window.location.search).get('code')
    const { baseUrl } = useContext(AppContext)
    const [tokens, setTokens] = useState({ 
        token: "",
        refreshToken: "",
        expiresIn: "",
    })

    useEffect(() => {
        if (code) {
            axios.post(`${baseUrl}/login`, {
                code
            })
            .then((res) => {
                console.log(res)
                setTokens({
                    token: res.data.access_token,
                    refresh_token: res.data.refresh_token,
                    expiresIn: res.data.expires_in
                })
                localStorage.setItem("token", res.data.access_token)
                localStorage.setItem("refresh_token", res.data.refresh_token)
                localStorage.setItem("expires_in", res.data.expires_in)
                window.history.pushState({}, null, "/")
                window.location = "/"
            })
            .catch((err) => {
                window.location = "/"
                console.log(err)
            })
        }
    }, [code])

    useEffect(() => {
        if (!tokens.refreshToken || !tokens.expiresIn) return
        const getRefreshToken = () => {
            axios.post(`${baseUrl}/refresh`, {
                tokens: tokens.refreshToken
            })
            .then((res) => {
                console.log(res)
                setTokens({
                    token: res.data.access_token,
                    refresh_token: res.data.refresh_token,
                    expiresIn: res.data.expires_in
                })
                localStorage.setItem("token", res.data.access_token)
                localStorage.setItem("refresh_token", res.data.refresh_token)
                localStorage.setItem("expires_in", res.data.expires_in)
                console.log("Token updated")
            })
            .catch((err) => {
                console.log(err)
                window.location = "/"
            })
        }

        setInterval(getRefreshToken, (tokens.expiresIn - 60) * 1000)

    }, [tokens.refreshToken, tokens.expiresIn])

    return tokens.token

}

export default Authenticate