import React, { useContext } from 'react'
import { AppContext } from '../Context/AppContext'

const Logout = () => {
    const { baseUrl } = useContext(AppContext)

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token");
        window.location.href = `${baseUrl}/logout`;
    }

    return (
        <button className="action_button" onClick={(e) => logout(e)}>
            Logout
        </button>
    )
}

export default Logout