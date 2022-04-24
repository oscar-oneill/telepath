import React, { useState, useEffect, useContext } from 'react'
import Login from './Login'
import reddit from '../assets/images/reddit.png'
import axios from 'axios'
import '../Styles/Navigation.css'
import Authorized from './Authorized'
import Autocomplete from './Autocomplete'
import { AppContext } from '../Context/AppContext'

const Navigation = () => {
  const [search, setSearch] = useState("")
  const [searchData, setSearchData] = useState("")
  const { over18, baseUrl } = useContext(AppContext)
  const token = localStorage.getItem("token")

  useEffect(() => {
    getSearch()
  }, [search])

  const updateSearch = (e) => {
    setSearch(e.target.value);
  }

  const getSearch = e => {
    axios.post(`${baseUrl}/search/autocomplete`, {
      token,
      search,
      over18
    })
    .then((res) => {
      setSearchData(res.data.subreddits)
    })
  }

  return (
    <>
      <div className="navbar">
        <a href="/">
          <div className="title">
            <span>Telepath</span>
            <img className="logo" src={reddit} alt="logo"/>
          </div>
        </a>

        <form className="form" id="form">
          <input className="input-request" type="text" autoComplete="false" placeholder="Search Reddit" value={search} onChange={updateSearch} required/>
          <button className="submit-btn" type="submit" name="submit-btn"><i className="fas fa-search"></i></button>
          <Autocomplete search={searchData} clearSearch={setSearch}/>
        </form>

        { token ? <Authorized/> : <Login/> }

      </div>
    </>
    )
}

export default Navigation

