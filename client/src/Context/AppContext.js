import { createContext, useState } from 'react';

export const AppContext = createContext()

export const AppContextProvider = props => {
  const [userData, setUserData] = useState(null);
  const [subscribed, setSubscribed] = useState(null);
  const [returnedSearch, setReturnedSearch] = useState("");
  const [over18, setOver18] = useState(null);
  const [filteredVideos, setFilteredVideos] = useState(null);
  const [baseUrl, setBaseUrl] = useState("http://localhost:5500")
//   const [baseUrl, setBaseUrl] = useState("https://telepath-server.vercel.app")

    return (
        <AppContext.Provider 
            value={{ 
                userData, setUserData, 
                subscribed, setSubscribed, 
                returnedSearch, setReturnedSearch, 
                over18, setOver18, 
                filteredVideos, setFilteredVideos,
                baseUrl, setBaseUrl,
            }}>
            {props.children}
        </AppContext.Provider>
    )
}