import React from 'react';

const SearchBox = ({ value, onChange}) => {
    return ( 
        <div className="searchBox">
          <input 
            type="text"
            name="query"
            className="form-control my-3"
            placeholder="Search for Articolo Name..."
            value={value}
            onChange={e => onChange(e.currentTarget.value)}
          />
       </div>
     );
};
 
export default SearchBox;