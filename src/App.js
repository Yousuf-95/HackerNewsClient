import React from 'react';
import './App.css';
import Search from './Components/Search-Component.jsx';
import Table from './Components/Table-Component';
import Button from './Components/Button-Component';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}${PARAM_PAGE}`;

class App extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      results : null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY
    }

    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);

    console.log(this.state.result);
  }

  onDismiss(id){
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];
    
    const updatedHits = hits.filter( item => (item.objectID !== id));
    this.setState({ results: {...results, [searchKey]: { hits: updatedHits, page}
    } });
  }

  onSearchChange(event){
    this.setState({ searchTerm: event.target.value });
  }

  setSearchTopStories(result){
    const { hits, page } = result;
    const { searchKey, results} = this.state;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [ ...oldHits, ...hits];
    
    this.setState({
      results: { 
        ...results,
        [searchKey] : { hits: updatedHits, page}
      }
    });
  }

  onSearchSubmit(event){

    event.preventDefault();
    const {searchTerm} = this.state;
    this.setState({ searchKey : searchTerm});

    if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
    }
  }

  fetchSearchTopStories(searchTerm, page = 0){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  render(){
    const { results, searchKey, searchTerm } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;

  const list = ( results && results[searchKey] && results[searchKey].hits) || [];

    // if(!result) { return null;}

    return(
      <div className = "page">
        <div className = "interactions">
        <Search value = {searchTerm} onChange = {this.onSearchChange} onSubmit = {this.onSearchSubmit}>
        Search</Search>
        </div>
        { results ? 
          <Table
          list = {list}
          // pattern = {searchTerm}
          onDismiss = {this.onDismiss} 
        >
          </Table> : 
          null
        }
        <div className = "interactions">
          <Button onClick = {() => this.fetchSearchTopStories(searchKey, page+1)}>More</Button>
        </div>
        
      </div>
    );
  }
}

export default App;