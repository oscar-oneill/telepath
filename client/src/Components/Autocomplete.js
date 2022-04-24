import React from 'react'
import { setIconFromSearch, setPrefix, setSearchRedirect } from '../utilities/Functions'

const Autocomplete = ({search, clearSearch}) => {
    const clearValues = () => {
        clearSearch("")
    }

    return (
        <div className="autocomplete_container">
            {search && search.map((x, i) => {
                return (
                    <a href={setSearchRedirect(x.name)} key={i} onClick={clearValues}>
                        <div className="autocomplete_item">
                            <img className="autocomplete_icon" src={setIconFromSearch(x)} alt="result"/>
                            {setPrefix(x.name)}
                        </div>
                    </a>
                )
            })}
        </div>
    )
}

export default Autocomplete