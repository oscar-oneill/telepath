import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import '../Styles/Subreddit.css';
import { AppContext } from '../Context/AppContext'
import SubredditBanner from '../Components/SubredditBanner';
import Media from '../Components/Media'
import { defaultImages } from '../utilities/images'
import { subredditPagination } from '../utilities/Functions'
import { domainFilter, videoFilter } from '../utilities/FetchMedia'
import axios from 'axios';

const Subreddit = () => {
    const subreddit = window.location.pathname.slice(3)
    const { baseUrl } = useContext(AppContext)
    const token = localStorage.getItem("token")
    const [videos, setVideos] = useState([])
    const [initialSet, setInitialSet] = useState([])
    const [nextSet, setNextSet] = useState([])
    // const [after, setAfter] = useState("")
    // const [loading, setLoading] = useState(false)
    // const [visibility, setVisibility] = useState(null)

    // Gets subreddit data upon navigation to a specific subreddit
    useEffect(() => {
        axios.post(`${baseUrl}/subreddit/feed`, {
            token,
            subreddit
        })
        .then((res) => {
            setInitialSet(res.data.posts) // Initial set of posts is stored in the 'initialSet' state
            // setAfter(res.data.after)
        })

    }, []) 

    useEffect(() => {
        // Posts from the initial set are now being filtered by the 'domainFilter' function
        const { arr } = domainFilter(initialSet)

        setNextSet(arr)
    }, [initialSet])

    useEffect(() => {
       const { arr } = videoFilter(nextSet)

       setTimeout(() => {
        setVideos(arr)
       }, 3000)
    }, [nextSet])

    // const observer = useRef()
    // const lastElementRef = useCallback((node) => {
    //     // if (loading) return;
    //     if (observer.current) observer.current.disconnect()
    //     observer.current = new IntersectionObserver(entries => {
    //         if (entries[0].isIntersecting && after) {
    //             console.log('visible...')
    //             setVisibility('visible')
    //             setLoading(true)
    //         }
    //     })

    //     if (node) observer.current.observe(node)
    // }, [after])

    // useEffect(() => {
    //     if (visibility === 'visible') {
    //         subredditPagination(subreddit, token, after)
    //         .then((res) => {
    //             setAfter(res.nextID)
    //             setInitialSet(res.obj.posts)
    //             appendNewPosts()
    //             setLoading(res.loading)
    //         })
    //     }

    // }, [loading, subreddit, token, after, visibility])

    // const appendNewPosts = () => {
    //     if (initialSet) {
    //         const { arr } = domainFilter(initialSet)
    //         setVideos(videos => [...videos, arr])
    //         setVisibility('invisible')
    //     }

    //     console.log(videos)
    // }

    return (
        <>
            <SubredditBanner/>
            <div className="subreddit_container">
                {
                    videos.length === 0
                        ?  
                    <div className="loading_container_2">
                        Loading content...
                        <img className="loading_gif" src={defaultImages.loading} alt="gif"/>
                    </div> 
                        : 
                    videos && videos.map((video, index) => {
                        if (videos.length === index + 1) {
                            return (
                                <div key={video.id}>
                                    <Media 
                                        author={video.author}
                                        domain={video.domain}
                                        permalink={video.permalink}
                                        subreddit={video.subreddit}
                                        timestamp={video.created_utc * 1000}
                                        title={video.title}
                                        ups={video.ups}
                                        url={video.url}
                                        id={video.id}
                                        vote={video.likes}
                                        saved={video.saved}
                                        video={video}
                                        comments={video.num_comments}
                                    />
                                </div>
                            )
                        } else {
                            return (
                                <div key={video.id}>
                                    <Media
                                        author={video.author}
                                        domain={video.domain}
                                        permalink={video.permalink}
                                        subreddit={video.subreddit}
                                        timestamp={video.created_utc * 1000}
                                        title={video.title}
                                        ups={video.ups}
                                        url={video.url}
                                        id={video.id}
                                        vote={video.likes}
                                        saved={video.saved}
                                        video={video}
                                        comments={video.num_comments}
                                    />
                                </div>
                            )
                        }
                    })
                }
            </div>
        </>
    )

}

export default Subreddit