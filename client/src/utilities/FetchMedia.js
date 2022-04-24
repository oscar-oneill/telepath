import axios from 'axios'

export const domainFilter = (data) => {
    let arr = []

    if (data) {
        data.map((video) => {
            const mp4 = video.domain === "gfycat.com" || video.domain === "redgifs.com" || video.domain === "v.redd.it";
            const gif = (video.domain.includes("imgur") && video.url.includes("gif")) || (video.domain === "i.redd.it" && video.url.includes("gif"))
            const wildcard = video.domain === "reddit.com"

            if (mp4 || gif) {
                arr.push(video)
            }

            if (!video.url.includes("gallery")) {
                if (wildcard) {
                    if (video.url.includes("predictions") || !mp4 || !gif) {
                        return null
                    } else {
                        arr.push(video)
                    }
                }
            }
        })
    }

    return { arr }
}

//--------------------//

export const videoFilter = (data) => {
    // Videos will either be removed on the host website or will be removed by reddit
    // In such cases, the 'post' will still be visible to the user with only the post's title
    // This function will determine if the video exists at all,
    // In the event that it does, it will iterate through the data and add the ones that do to a new array
    
    if (data) {
        let arr = []

        data.map(async (item) => {
            if (item.domain === "gfycat.com") {
                const x = item.url.replace("https://gfycat.com/", "")
                const findings = x.includes("-") ? x.indexOf("-") : "";
                const adjustedID = findings ? x.slice(0, findings) : "";
                const finalID = adjustedID ? adjustedID : x;
                const gfycatData = await fetch(`https://api.gfycat.com/v1/gfycats/${finalID}`);
                const data = await gfycatData.json();

                if (data.errorMessage || data.message) return
                arr.push(item)
            }

            if (item.domain.includes("imgur")) {
                const i = item.url.lastIndexOf("/")
                const z = item.url.slice(i + 1)
                const a = z.indexOf(".")
                const hash = z.slice(0, a)
                const imgurPost = await fetch(`https://api.imgur.com/3/image/${hash}`, {
                    headers: {
                        Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`
                    }
                })
                const data = await imgurPost.json()
                
                if (!data) return
                arr.push(item)
            }

            if (item.domain === "redgifs.com") {
                const string = "/watch/"
                const len = string.length
                const search = item.url.search(string)
                const id = item.url.slice(search + len)

                const response = await fetch(`https://api.redgifs.com/v2/gifs/${id}`)
                const data = await response.json()

                if (data.errorMessage || data.message) return
                arr.push(item)
                
            }

            if (item.domain === "v.redd.it") {
                // 
                arr.push(item)
            }

            if (item.domain === "i.redd.it") {
                // 
                arr.push(item)
            }
        })
        return { arr }
    }
}   

//--------------------//

// All posts have varying domains, this function will return the JSX respective to each one
export const setVideoByDomain = async (domain, postUrl, vreddit, video) => {
    if (domain === "i.redd.it" && postUrl.includes("gif")) {
        return (
            <div className="media_box">
                <img src={postUrl} alt="gif"/>
            </div>
        )
    } 
    
    if (domain.includes("imgur") && postUrl.includes("gif")) {
        const regex = /gifv?/g
        const imgur = postUrl.match(regex) ? postUrl.replace(regex, "mp4") : null;
        const poster = postUrl.match(regex) ? postUrl.replace(regex, "png") : null;   

        return (
            <div className="media_box">
                <video className="media" preload="true" playsInline controls muted poster={poster}>
                    <source src={imgur} type="video/mp4"/>
                </video>
            </div>
        )
    }
    
    if (domain === "gfycat.com") {
        
        const x = postUrl.replace("https://gfycat.com/", "")

        const findings = x.includes("-") ? x.indexOf("-") : "";
        const adjustedID = findings ? x.slice(0, findings) : "";
        const finalID = adjustedID ? adjustedID : x;
        const gfycatData = await fetch(`https://api.gfycat.com/v1/gfycats/${finalID}`);
        const data = await gfycatData.json();

        const gfycat = data.errorMessage || data.message ? null : data.gfyItem.mobileUrl;
        const gfycatPoster = data.errorMessage || data.message ? null : data.gfyItem.posterUrl;

        if (data.errorMessage || data.message) return
        return (
            <div className="media_box">
                <video className="media" preload="true" playsInline controls muted poster={gfycatPoster}>
                    <source src={gfycat} type="video/mp4" />
                </video>
            </div>
        )
    }

    if (domain === "redgifs.com") {
        const string = "/watch/"
        const len = string.length
        const search = postUrl.search(string)
        const id = postUrl.slice(search + len)

        const redgifsData = await fetch(`https://api.redgifs.com/v2/gifs/${id}`)
        const data = await redgifsData.json()
        const redgifs = data.errorMessage || data.message ? null : data.gif.urls.hd
        const redgifsPoster = data.errorMessage || data.message ? null : data.gif.urls.poster 

        return (
            <div className="media_box">
                <video className="media" preload="true" playsInline controls muted poster={redgifsPoster}>
                    <source src={redgifs} type="video/mp4"/>
                </video>
            </div>
        )
    }
    
    if (domain === "v.redd.it") {
        const poster = video.thumbnail
        return (
            <div className="media_box">
                <video className="media" preload="true" playsInline controls muted poster={poster}>
                    <source src={vreddit} type="video/mp4"/>
                </video>
            </div>
        )
    }

    // Instagram, Streamable, Giphy, Youtube

    // Posts from the "reddit.com" domain are posts previously posted to a separate subreddit
    // Not exactly a crosspost, but it is something like it
    // These posts have variable domains
    // The purpose of this if-statement is to find the original domain of that post and parse the data
    
    if (domain === "reddit.com") {
        console.log(postUrl)
        const url = postUrl.replace("www", "api")
        const response = await fetch(url)
        const data = await response.json()

        if (data.reason) {
            // This is an error returned by the reddit API if a subreddit is banned
            return ""
        } else {
            const repost = data[0].data.children[0].data 
            if (repost.domain === "i.redd.it" && repost.url.includes("gif")) {
                return (
                    <div className="media_box">
                        <img src={repost.url} alt="gif"/>
                    </div>
                )
            } 

            if (repost.domain.includes("imgur") && repost.url.includes("gif")) {
                const regex = /gifv?/g
                const imgur = repost.url.match(regex) ? repost.url.replace(regex, "mp4") : null
                
                return (
                    <div className="media_box">
                        <video className="media" preload="true" playsInline controls muted poster={""}>
                            <source src={imgur} type="video/mp4"/>
                        </video>
                    </div>
                )
            }

            if (repost.domain === "gfycat.com") {
                const x = repost.url.replace("https://gfycat.com/", "")
                const gfycatData = await fetch(`https://api.gfycat.com/v1/gfycats/${x}`);
                const data = await gfycatData.json();
                const gfycat = data.errorMessage || data.message ? null : data.gfyItem.mobileUrl;
                const gfycatPoster = data.errorMessage || data.message ? null : data.gfyItem.posterUrl;

                return (
                    <div className="media_box">
                        <video className="media" preload="true" playsInline controls muted poster={gfycatPoster}>
                            <source src={gfycat} type="video/mp4"/>
                        </video>
                    </div>
                )
            }

            if (repost.domain === "redgifs.com") {
                const string = "/watch/"
                const len = string.length
                const search = repost.url.search(string)
                const x = repost.url.slice(search + len)
                const redgifsData = await fetch(`https://api.redgifs.com/v2/gifs/${x}`)
                const data = await redgifsData.json()
                const redgifs = data.errorMessage || data.message ? null : data.gif.urls.hd
                const redgifsPoster = data.errorMessage || data.message ? null : data.gif.urls.poster 

                return (
                    <div className="media_box">
                        <video className="media" preload="true" playsInline controls muted poster={redgifsPoster}>
                            <source src={redgifs} type="video/mp4"/>
                        </video>
                    </div>
                )
            }

            if (repost.secure_media) {
                if (repost.domain === "v.redd.it") {
                    let vreddit = repost.media.reddit_video.fallback_url;

                    return (
                        <div className="media_box">
                            <video className="media" preload="true" playsInline controls muted>
                                <source src={vreddit} type="video/mp4"/>
                            </video>
                        </div>
                    )
                }
            }
        }
    }
}