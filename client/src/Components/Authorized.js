import React, { useRef, useState, useContext, useEffect }  from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import DarkMode from './DarkMode'
import { defaultImages } from '../utilities/images'
import axios from 'axios'

const Authorized = () => {
    const optionsRef = useRef(null);
    const [menu, setMenu] = useState(false);
    const showMenu = () => setMenu(!menu);

    const { userData, setOver18, baseUrl } = useContext(AppContext);
    const [first, setFirst] = useState("");
    const [icon, setIcon] = useState("");

    useEffect(() => {
        if (userData) {
            setFirst(userData.data.name)
            setOver18(userData.data.over_18)

            if (userData.data.icon_img) {
                if (userData.data.icon_img.includes("redditstatic")) {
                    setIcon(userData.data.icon_img)
                } else {
                    const str = userData.data.icon_img
                    const find = str.search("width")
                    const slice = str.slice(0, find - 1)

                    setIcon(slice)
                }
            } 

        }
    }, [userData])

    const logout = (e) => {
        e.preventDefault();
       axios.post(`${baseUrl}/auth/logout`)
        .then((res) => {
            console.log(res)
        })
        localStorage.clear();
        window.location = "/";
    }

    return (
        <>
            <div className="signed_in" onClick={showMenu}>  
                <span>{first}</span>
                <img className="signed_icon" src={ icon ? icon : defaultImages.profile } alt="avatar"/>
            </div>
            <div ref={optionsRef} className={`nav_menu ${menu ? "active" : "inactive"}`} >
                <ul className="menu_items">
                    <li onClick={() => showMenu(false)}>
                        <Link to="/me">Profile</Link>
                    </li>
                    <li onClick={() => showMenu(false)}>
                        <DarkMode/>
                    </li>
                    <li onClick={(e) => logout(e)}>Logout</li>
                </ul>
            </div>
        </>
    )
}

export default Authorized
