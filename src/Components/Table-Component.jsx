 import React from 'react';
 import Button from './Button-Component';
 import './Table-Component.css';


// const isSearched = (searchTerm) => (item) => item.title.toLowerCase().includes(searchTerm.toLowerCase());

const Table = ({list, onDismiss}) =>
        <div className = "table">
            {
                list.map( item =>   
                <div key = {item.objectID} className = "table-row">
                    <span style = {{width: '30%'}}><a href = {item.url}>{item.title}</a></span>
                    <span style = {{width: '30%'}}>{item.author}</span>
                    <span style = {{width: '20%'}}>{item.points}</span>
                    <span style = {{width: '20%'}}><Button onClick = { () => onDismiss(item.objectID)} className = "button-inline"> Dismiss </Button></span>
                </div>
                )
            }
        </div>

 export default Table;

