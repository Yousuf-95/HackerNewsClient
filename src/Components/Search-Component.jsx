import React from 'react';
// import './Search-Component.scss';

const Search  = ({value, onChange, onSubmit, children}) =>
        <form onSubmit = {onSubmit}>
            <input type = "text" value = {value} onChange = {onChange}  />
            <button type = "submit">{children}</button>
        </form>

export default Search;