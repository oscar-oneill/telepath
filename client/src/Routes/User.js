import React, { useState, useRef, useEffect, useCallback, useContext} from 'react';
import { AppContext } from '../Context/AppContext'
import '../Styles/Subreddit.css';
import Media from '../Components/Media'
import { defaultImages } from '../utilities/images'
import { subredditPagination } from '../utilities/Functions'
import { domainFilter, videoFilter } from '../utilities/FetchMedia'
import UserBanner from '../Components/UserBanner';
import axios from 'axios';

const User = () => {
  const user = window.location.pathname.slice(3)
  const { baseUrl } = useContext(AppContext)
  const token = localStorage.getItem("token")
  const [videos, setVideos] = useState([])
  const [initialSet, setInitialSet] = useState([])
  const [nextSet, setNextSet] = useState([])

  // Gets subreddit data upon navigation to a specific subreddit
  useEffect(() => {
    axios.post(`${baseUrl}/data/feed`, {
      token,
      user
    })
      .then((res) => {
        setInitialSet(res.data.posts) // Initial set of posts is stored in the 'initialSet' state
        // setAfter(res.data.after)
      })

  }, [])

  useEffect(() => {
    // Posts from the initial set are now being filtered by the 'domainFilter' function
    const { arr } = domainFilter(initialSet)
    setNextSet(arr) // Filtered videos are stored in the final state, the 'video' state; these elements now appear on the screen
  }, [initialSet])

  useEffect(() => {
    const { arr } = videoFilter(nextSet)

    setTimeout(() => {
      setVideos(arr)
    }, 3000)
  }, [nextSet])

  return (
    <>
      <UserBanner/>
      <div className="subreddit_container">
        {
          videos.length === 0
            ?
            <div className="loading_container_2">
              Loading content...
              <img className="loading_gif" src={defaultImages.loading} alt="gif" />
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

export default User