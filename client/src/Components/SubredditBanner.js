import React, { useEffect, useState, useContext } from 'react';
import '../Styles/SubredditBanner.css';
import { convertedDate, setBanner, setImage, truncateText, stringFilter } from '../utilities/Functions';
import { SubscriberStatus } from '../utilities/Helpers'
import nsfw from '../assets/images/over18.png';
import { AppContext } from '../Context/AppContext'
import { defaultImages, gradient } from '../utilities/images';
import axios from 'axios';

const SubredditBanner = () => {
    const token = localStorage.getItem("token");
    const subreddit = window.location.pathname.slice(3);
    const { setSubscribed, baseUrl } = useContext(AppContext)
    const [data, setData] = useState("");
    const [core, setCore] = useState({
        name: "",
        description: "",
        subscribers: "",
        users: "",
        created: "",
    });
    const subredditBanner = setBanner(data);
    const subredditImage = setImage(data);
     
    useEffect(() => {
        if (subreddit) {
            axios.post(`${baseUrl}/subreddit/about`, {
                subreddit,
                token
            })
            .then((res) => {
                setData(res.data);
                setCore({   
                    name: res.data.display_name_prefixed,
                    description: res.data.public_description,
                    subscribers: res.data.subscribers,
                    users: res.data.active_user_count,
                    created: convertedDate(res.data.created_utc * 1000),
                    isNSFW: res.data.over18,
                    subredditID: res.data.name
                });
                setSubscribed(res.data.user_is_subscriber)

            });
        }
    }, [subreddit, token]);

    const setStyle = () => {
        if (subredditBanner) {
            return { backgroundImage: subredditBanner, width: "100%", objectFit: "cover", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat"}
        } else if (data.primary_color) {
            return { backgroundColor: data.primary_color }
        } else if (data.key_color) {
            return { backgroundColor: data.key_color }
        } else {
            return { backgroundImage: `url(${gradient.sub})`, width: "100%", objectFit: "cover", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat" }
        }
    } 

    return (
        <div className="sub_container" style={setStyle()}>
            <div className="content_container">
                <div className="box-1">
                    <img className="sub_icon" src={ subredditImage ? subredditImage : defaultImages.default } alt="subreddit"/>
                    <div className="info-pane">
                        <span className="name">
                            {core.name}

                            {core.isNSFW ? <img className="nsfw_banner" src={nsfw} alt="nsfw"/> : ""}

                            <SubscriberStatus token={token} subreddit={subreddit} subredditID={core.subredditID} statusA="Joined" statusB="Join" origin="subreddit"/>

                        </span>

                        <div className="info">
                            {truncateText(stringFilter(core.description))}
                        </div>

                        <br/>
                    </div> 
                </div>
                <div className="box-2">
                    <div className="mini-1">
                        Subscribers <br/>{core.subscribers.toLocaleString()}
                    </div>
                    <div className="mini-2">
                        Users Online <br/>{core.users.toLocaleString()}
                    </div>
                    <div className="mini-3">
                        Date Created <br/>{core.created}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubredditBanner