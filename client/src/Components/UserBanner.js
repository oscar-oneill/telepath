import React, { useEffect, useState, useContext } from 'react';
import '../Styles/SubredditBanner.css';
import { convertedDate, setBanner, setImage, truncateText, stringFilter } from '../utilities/Functions';
import { SubscriberStatus } from '../utilities/Helpers'
import nsfw from '../assets/images/over18.png';
import { AppContext } from '../Context/AppContext'
import { defaultImages, gradient } from '../utilities/images';
import axios from 'axios';

const UserBanner = () => {
    const token = localStorage.getItem("token")
    const user = window.location.pathname.slice(3)
    const { setSubscribed, baseUrl} = useContext(AppContext)
    const [data, setData] = useState("")
    const [core, setCore] = useState({
        name: "",
        description: "",
        karma: {
            total: "",
            comment: "",
            link: ""
        },
        isNSFW: "",
        created: "",
        subredditID: "",
        snoovatar: ""
    });
    const userBanner = setBanner(data.subreddit);
    const userImage = setImage(data.subreddit);

    useEffect(() => {
        if (user) {
            axios.post(`${baseUrl}/data/user`, {
                user,
                token
            })
            .then((res) => {
                setData(res.data);
                setCore({
                    name: res.data.subreddit.display_name_prefixed,
                    description: res.data.subreddit.public_description,
                    karma: {
                        total: res.data.total_karma,
                        comment: res.data.comment_karma,
                        link: res.data.link_karma,
                    },
                    created: convertedDate(res.data.created_utc * 1000),
                    isNSFW: res.data.subreddit.over18,
                    subredditID: res.data.subreddit.name,
                    snoovatar: res.data.snoovatar_img
                });
                setSubscribed(res.data.subreddit.user_is_subscriber)
            });
        }
    }, [user, token]);

    const setStyle = () => {
        if (userBanner) {
            return { backgroundImage: userBanner, width: "100%", objectFit: "cover", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat" }
        } else if (data.primary_color) {
            return { backgroundColor: data.primary_color }
        } else if (data.key_color) {
            return { backgroundColor: data.key_color }
        } else {
            return { backgroundImage: `url(${gradient.user})`, width: "100%", objectFit: "cover", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat"}
        }
    } 

  return (
    <div className="sub_container" style={setStyle()}>
        <div className="content_container">
            <div className="box-1">
                <img className="sub_icon" src={userImage ? userImage : defaultImages.default} alt="subreddit" />
                <div className="info-pane">
                    <span className="name">
                        {core.name}

                        {core.isNSFW ? <img className="nsfw_banner" src={nsfw} alt="nsfw" /> : ""}

                        <SubscriberStatus token={token} subreddit={user} subredditID={core.subredditID} statusA="Following" statusB="Follow" origin="user" />

                    </span>

                    <div className="info">
                          {truncateText(stringFilter(core.description))}
                    </div>

                    <br />
                </div>
            </div>
            <div className="box-2">
                <div className="mini-1">
                    Link Karma <br />{core.karma.link.toLocaleString()}
                </div>
                <div className="mini-2">
                    Comment Karma <br />{core.karma.comment.toLocaleString()}
                </div>
                <div className="mini-3">
                    Date Joined <br />{core.created}
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserBanner