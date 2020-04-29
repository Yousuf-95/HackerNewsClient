 import React from 'react';
 import Button from './Button-Component';
 import './Table-Component.css';
 import {sortBy} from 'lodash';


// const isSearched = (searchTerm) => (item) => item.title.toLowerCase().includes(searchTerm.toLowerCase());

const SORTS = {
    NONE : list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse()
  };

  const Sort = ({ sortKey, onSort, activeSortKey, children}) => {
      
    const sortClass = ['button-inline'];
    if(sortKey === activeSortKey)
    sortClass.push('button-active');
        return(
          <Button onClick = { () => onSort(sortKey)} className = {sortClass.join(' ')}> {children} </Button>
        ); 
  }

    const Table = ({list, sortKey, isSortReverse, onSort, onDismiss}) => {

        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
        
        return(
            <div className = "table">
                <div className = "table-header">
                    <span style = {{width: '30%' }}><Sort sortKey = {'TITLE'} onSort = {onSort} activeSortKey = {sortKey} >Title</Sort></span>
                    <span style = {{width: '30%' }}><Sort sortKey = {'AUTHOR'} onSort = {onSort} activeSortKey = {sortKey} >Author</Sort></span>
                    <span style = {{width: '20%' }}><Sort sortKey = {'POINTS'} onSort = {onSort} activeSortKey = {sortKey} >Points</Sort></span>
                    <span style = {{width: '20%' }}></span>
                </div>
                {
                    reverseSortedList.map( item =>   
                    <div key = {item.objectID} className = "table-row">
                        <span style = {{width: '30%'}}><a href = {item.url}>{item.title}</a></span>
                        <span style = {{width: '30%'}}>{item.author}</span>
                        <span style = {{width: '20%'}}>{item.points}</span>
                        <span style = {{width: '20%'}}><Button onClick = { () => onDismiss(item.objectID)} className = "button-inline"> Dismiss </Button></span>
                    </div>
                    )
                }
            </div>
        );
    }
 export default Table;

