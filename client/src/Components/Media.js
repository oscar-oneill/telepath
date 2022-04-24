import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { setPrefix, activityStyles as setActivityStyles, stringFilter, elapsedTime } from '../utilities/Functions'
import { setVideoByDomain } from '../utilities/FetchMedia'
import { SetFlair, ShareLink } from '../utilities/Helpers'
import axios from 'axios'
import '../Styles/Post.css'
import { defaultImages } from '../utilities/images'

const Media = ({ author, domain, permalink, subreddit, timestamp, title, ups, url, id, vote, saved, video, comments }) => {
    const token = localStorage.getItem("token")
    const [media, setMedia] = useState(null)
    const { baseUrl } = useContext(AppContext)
    const [voteCount, setVoteCount] = useState(ups)
    const [voteStatus, setVoteStatus] = useState(vote)
    const [savedStatus, setSavedStatus] = useState(saved)
    let link = "https://www.reddit.com" + permalink
    let pathname = window.location.pathname.includes("/r/")

    const [icon, setIcon] = useState(null)
    const [vreddit, setVreddit] = useState(null)
    const [flair, setFlair] = useState({
        text: "",
        color: "",
        textColor: ""
    })

    useEffect(() => {
        if (video) {
            axios.get(`https://api.reddit.com/r/${video.subreddit}/about`)
            .then((data) => {                
                let image = data.data.data.icon_img ? data.data.data.icon_img : data.data.data.community_icon ? data.data.data.community_icon : data.data.data.header_img ? data.data.data.header_img : defaultImages.default
                setIcon(image)
            })
        }

        if (video.secure_media) {
            if (video.domain === "v.redd.it") {
                setVreddit(video.media.reddit_video.fallback_url)
            }
        }

        setFlair({
            text: video.link_flair_richtext ? video.link_flair_richtext[0] : null,
            emoji: video.link_flair_richtext[1] ? video.link_flair_richtext[1] : null,
            color: video.link_flair_background_color,
            textColor: video.link_flair_text_color,
        })

    }, [video])

    const assignImage = () => {
        if (icon) {
            if (icon.includes("/styles/")) {
                let i = 1
                let x = icon.search("width") - i
                let z = icon.slice(0, x)
                return z
            } else {
                return icon
            }
        }
    }
    const subredditImage = assignImage()

    useEffect(() => {
        setVideoByDomain(domain, url, vreddit, video)
        .then((res) => {
            setMedia([res])
        })
    }, [domain, url, vreddit, video]) 

    const upvoting = () => {
        let dir = voteStatus === null ? "1" : voteStatus === true ? "0" : voteStatus === false ? "1" : null

        axios.post(`${baseUrl}/action/vote`, {
            id,
            dir,
            token
        })
        .then((res) => {
            setVoteCount(res.data.ups)
            setVoteStatus(res.data.likes)
        })
    }

    const downvoting = () => {
        let dir = voteStatus === null ? "-1" : voteStatus === false ? "0" : voteStatus === true ? "-1" : null

        axios.post(`${baseUrl}/action/vote`, {
            id,
            dir,
            token
        })
        .then((res) => {
            setVoteCount(res.data.ups)
            setVoteStatus(res.data.likes)
        }) 
    }

    const savePost = () => {
        if (!savedStatus) {
            axios.post(`${baseUrl}/action/save`, {
                id,
                token
            })
            .then((res) => {
                setSavedStatus(res.data.saved)
            }) 
        } else {
            axios.post(`${baseUrl}/action/unsave`, {
                id,
                token
            })
            .then((res) => {
                setSavedStatus(res.data.saved)
            }) 
        }
    }

    return (
        <div className="container">
            <div className="identifier">
                <div className="subreddit_img">
                    <a href={`/${setPrefix(subreddit)}`}>
                        <img className="subreddit_icon" src={subredditImage ? subredditImage : defaultImages.default } alt="subreddit icon"/>
                    </a>
                </div>
                <div className="nameplate">
                    <div className="primary_data">
                        <a href={`/${setPrefix(subreddit)}`}>{setPrefix(subreddit)}</a>
                        <span><a href={`/u/${author}`}><span className="user">u/{author}</span></a>&#183;<a href={url} target="_blank" rel="noopener noreferrer nofollow"><span className="domain">{domain.includes("imgur") ? "imgur.com" : domain}</span></a> &#183; <span className="date">{elapsedTime(timestamp)}</span></span> 
                    </div>
                </div>
            </div>

            <div className="secondary_data">
                <span className="post_title">{stringFilter(title)}</span>

                <SetFlair flair={flair} pathname={pathname}/>
            </div>

            <>{media}</>

            <div className="post_data">
                <div className="activity">
                    {
                        !token
                            ?
                        <div><i className="las la-heart la-1x inactive"></i> <span className="total_likes">{ups.toLocaleString()} Upvotes</span></div>
                            :
                        <>
                            <div className="voting_actions">
                                <i onClick={upvoting} id="upvote" className="fas fa-arrow-up la-lg" style={voteStatus === true ? setActivityStyles.true : setActivityStyles.null}></i>
                                <span className="total_likes">{voteCount.toLocaleString()}</span> 
                                <i onClick={downvoting} id="downvote" className="fas fa-arrow-down la-lg" style={voteStatus === false ? setActivityStyles.false : setActivityStyles.null}></i>
                            </div>

                            <div className="content"><i className="far fa-comment la-lg spacing"></i>{comments.toLocaleString()}</div>
                            {ShareLink(link)}
                            {/* <div className="content"><i className="fas fa-gift spacing"></i>Award</div> */}
                            <div className="content" onClick={savePost}>
                                {savedStatus ? <i className="fas fa-bookmark bookmark"></i> : <i className="las la-bookmark la-lg bookmark"></i> } {savedStatus ? "Saved" : "Save"}
                            </div>
                            {/* <div className="content"><i className="las la-download la-2x"></i>Download</div> */}
                                
                        </>
                    }
                </div>
                <div className="date_box">
                    
                </div>
            </div>
        </div>   
    )
}

export default Media