import React from 'react';
// import sortBy from 'lodash';
import './App.css';
import Search from './Components/Search-Component.jsx';
import Table from './Components/Table-Component';
import Button from './Components/Button-Component';
import Loading from './Components/Loading-Component';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}${PARAM_PAGE}`;

const withLoading = (Component) => ({ isLoading, ...rest }) =>
isLoading
? <Loading />
: <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

class App extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      results : null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false
    }

    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.onSort = this.onSort.bind(this);

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
      },
      isLoading: false
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
    this.setState({ isLoading: true });
    
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => this.setState({ error}));
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }

  onSort(sortKey){
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;

    this.setState({ sortKey, isSortReverse });
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  render(){
    const { results, searchKey, searchTerm, error, isLoading, sortKey, isSortReverse} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;

  const list = ( results && results[searchKey] && results[searchKey].hits) || [];

    // if(!result) { return null;}

    return(
      <div className = "page">
        <div className = "interactions">
        <Search value = {searchTerm} onChange = {this.onSearchChange} onSubmit = {this.onSearchSubmit}>
        Search</Search>
        </div>
        { error ? 
          <div className = "interactions">
            <p>Something went Wrong</p>
          </div> : 
          <Table
          list = {list}
          sortKey = {sortKey}
          isSortReverse = { isSortReverse }
          onSort = {this.onSort}
          // pattern = {searchTerm}
          onDismiss = {this.onDismiss} 
          >
          </Table> 
        }
        <div className = "interactions">
          {
            // isLoading ? <Loading /> : <Button onClick = {() => this.fetchSearchTopStories(searchKey, page+1)}>More</Button>
            <ButtonWithLoading isLoading = {isLoading} onClick = { () => this.fetchSearchTopStories(searchKey, page + 1)}>More</ButtonWithLoading>
          }
        </div>
        
      </div>
    );
  }
}

export default App;