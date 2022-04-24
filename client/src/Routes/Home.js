import React, { useEffect, useState, useContext } from 'react'
import Media from '../Components/Media';
import '../Styles/Home.css';
import axios from 'axios'
import { AppContext } from '../Context/AppContext'
import { defaultImages } from '../utilities/images'
import { domainFilter, videoFilter } from '../utilities/FetchMedia'

const Home = () => {
  const token = localStorage.getItem("token")
  const { baseUrl } = useContext(AppContext)
  const [videos, setVideos] = useState([])
  const [initialSet, setInitialSet] = useState([])
  const [nextSet, setNextSet] = useState([])

  // const [after, setAfter] = useState("")

  useEffect(() => {
    axios.post(`${baseUrl}/feed/all`, {
      token
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

  if (videos.length === 0) {
    return (
      <div className="loading_container">
        Loading content...
        <img className="loading_gif" src={defaultImages.loading} alt="gif"/>
      </div>
    )
  } else {
    return (
      <div className="home_container"> 
        {videos && videos.map((video) => (
          <Media
            key={video.id}
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
        ))}
      </div>
    )
  }
}

export default Home