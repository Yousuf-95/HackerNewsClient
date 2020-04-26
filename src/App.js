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
      result : '',
      searchTerm: DEFAULT_QUERY
    }

    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);

    console.log(this.state.result);
  }

  onDismiss(id){
    const updatedHits = this.state.result.hits.filter( item => (item.objectID !== id));
    this.setState({ result: {...this.state.result, hits: updatedHits} });
  }

  onSearchChange(event){
    this.setState({ searchTerm: event.target.value });
  }

  setSearchTopStories(result){
    this.setState({result});
  }

  onSearchSubmit(event){
    event.preventDefault();
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  fetchSearchTopStories(searchTerm, page = 0){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  render(){
    const { result, searchTerm } = this.state;
    const page = (result && result.page) || 0;

    // if(!result) { return null;}

    return(
      <div className = "page">
        <div className = "interactions">
        <Search value = {searchTerm} onChange = {this.onSearchChange} onSubmit = {this.onSearchSubmit}>
        Search</Search>
        </div>
        { result ? 
          <Table
          list = {result.hits}
          // pattern = {searchTerm}
          onDismiss = {this.onDismiss} 
        >
          </Table> : 
          null
        }
        <div className = "interactions">
          <Button onClick = {() => this.fetchSearchTopStories(searchTerm, page+1)}>More</Button>
        </div>
        
      </div>
    );
  }
}

export default App;