import { defaultImages } from '../utilities/images'
import moment from 'moment'

export const convertedDate = (createdUTC) => {
    let utc = createdUTC;
    let d = new Date(utc)
    let formatted = d.toLocaleString('en-US', { hour12: false })
    let find = formatted.search(",")
    let finalOutput = formatted.slice(0, find)

    return finalOutput
}

export const elapsedTime = (createdUTC) => {
    let utc = createdUTC;
    let d = new Date(utc)
    let x = moment(d).fromNow()

    return x
}

export const setBanner = (data) => {
    if (data) {
        let banner = data.banner_background_image ? data.banner_background_image : data.banner_img ? data.banner_img : "";
        if (banner) {
            if (banner.includes("/styles/")) {
                let i = 1
                let x = banner.search("width") - i
                let z = banner.slice(0, x)

                let newUrl = `linear-gradient(rgba(36, 36, 36, 0.39) 0%, rgb(24, 20, 20) 100%), url(${z})`
                return newUrl
            } else {

                let url = `linear-gradient(rgba(36, 36, 36, 0.39) 0%, rgb(24, 20, 20) 100%), url(${banner})`
                return url
            }
        }
    }
}

export const setImage = (data) => {     
    if (data) {
        let icon = data.icon_img ? data.icon_img : data.community_icon ? data.community_icon : data.header_img ? data.header_img : defaultImages.default;

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
}

export const truncateText = (text) => {
    return text.length > 100 ? text.substring(0, 90) + "..." : text;
}

export const setIconFromSearch = (data) => {
    if (data) {
        let icon = data.icon ? data.icon : data.communityIcon ? data.communityIcon : defaultImages.default;

        if (icon) {
            if (icon.includes("/styles/" && "width")) {
                let i = 1
                let x = icon.search("width") - i
                let z = icon.slice(0, x)
                return z
            } else {
                return icon
            }
        }
    }
}

export const setPrefix = (data) => {
    if (data[0] === "u" ) {
        let x = data.replace("_", "/")
        return x
    } else {
        return "r/"+data
    }
}

export const stringFilter = (string) => {
    const title = string
    const finalString = title.replace("&amp;", "&")
    
    return finalString
}

export const setSearchRedirect = (data) => {
    if (data[0] === "u") {
        let user = data.slice(2)
        return `/u/${user}`
    } else {
        return `/r/${data}`
    }
}

export const activityStyles = {
    "true": {
        color: "var(--like)"
    },
    "null": {
        color: "var(--text-color)"
    },
    "false": {
        color: "var(--downvote)"
    },
    "saved": {
        color: "var(--save)"
    }
}

export const subredditPagination = async (x, y, z) => {
    const subreddit = x
    const token = y
    const after = z

    let obj = {};
    let nextID;

    let loading = false

    const body = {
        token: token,
        subreddit: subreddit,
        after: after
    }

    const response = await fetch("https://telepath-server.vercel.app/subreddit/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })

    const data = await response.json()

    obj = {
        posts: data.posts,
    }
    nextID = data.after

    return { obj, nextID, loading }
}





















