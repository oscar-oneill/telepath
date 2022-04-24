import { useEffect, useContext } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContext } from './Context/AppContext'
import Home from './Routes/Home';
import Navigation from './Components/Navigation';
import auth from './Hooks/authenticate'
import axios from 'axios';
import Subreddit from './Routes/Subreddit';
import User from './Routes/User'

const App = () => {
  const { setUserData, baseUrl } = useContext(AppContext)
  const authenticate = auth()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      axios.post(`${baseUrl}/data/profile`, {
        token
      })
      .then((res) => {
        setUserData(res)
      })
    }
  }, [token]);

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation token={token}/>
        <Routes>
          <Route path="/" exact element={<Home/>}/>
          <Route path="/me" />
          <Route path="/u/:user" element={<User/>}/>
          <Route path="/r/:subreddit" element={<Subreddit/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
