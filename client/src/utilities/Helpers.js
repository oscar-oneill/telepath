import { useContext, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from 'axios'

export const SetFlair = ({ flair, pathname }) => {
    if (flair && pathname) {
        return (
            <div
                className="post_flair"
                style={{
                    background: `${flair.color ? flair.color : (!flair.color && flair.textColor === 'dark') ? "#EDEFF1" : (!flair.color && flair.textColor === 'light') ? "#000000" : null}`,
                    color: `${flair.textColor === 'dark' ? '#000000' : '#ffffff'}`
                }}
            >
                <span className="flair_container">
                    {flair.text ? flair.text.t : null}
                    {flair.emoji ? <img className="emoji_flair" src={flair.emoji.u} alt="emoji" /> : null}
                </span>
            </div>
        )
    } else {
        return null
    }
}

export const SubscriberStatus = ({ token, subreddit, subredditID, statusA, statusB, origin }) => {
    const { subscribed, setSubscribed, baseUrl } = useContext(AppContext)

    const updateStatus = () => {
        if (subscribed === true) {
            axios.post(`${baseUrl}/subreddit/unsubscribe`, {
                token,
                subredditID,
                subreddit, 
                origin
            })
            .then((res) => {
                setSubscribed(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        }

        if (subscribed === false) {
            axios.post(`${baseUrl}/subreddit/subscribe`, {
                token,
                subredditID,
                subreddit,
                origin
            })
            .then((res) => {
                setSubscribed(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    return (
        <>
            {token ? <div className="subscriber" onClick={updateStatus}>{subscribed ? statusA : statusB}</div> : ""}
        </>
    )
}

export const ShareLink = (link) => {
    const [isCopied, setIsCopied] = useState(false);

    const onCopyText = () => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }

    return (
        <CopyToClipboard text={link} onCopy={onCopyText}>
            <span>{isCopied ? "Copied!" : <div className="content"><i className="fas fa-external-link-alt spacing"></i>Share</div>}</span>
        </CopyToClipboard>
    );
}