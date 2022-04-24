import React, { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import windowDetect from '../Hooks/windowDetect'

const Login = () => {
    const size = windowDetect()
    const { baseUrl } = useContext(AppContext)

    return (
        <button className="action_button">
            <a href={`${baseUrl}/reddit`}>
                {size.width < 857 ? "Login" : "Login with Reddit"}
            </a>
        </button>
    )
}

export default Login
