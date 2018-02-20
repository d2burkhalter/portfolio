import React, {Component} from 'react';
//import SearchButton from '../SearchButton/SearchButton.js';
import ListButton from '../ListButton/ListButton.js';
//import TextButton from '../TextButton/TextButton.js';
import './style.css';
//displays input that user can sort reviews by
class SearchBar extends Component {

  render() {
    return (
      <div className="Search-Container">
        <div className="Search-Label">MATCH MY SIZE:</div>
        <div className="Search-Row">
          <ListButton
            name={this.props.categories[0].name}
            values={this.props.categories[0].values}
            onChange={(i) => this.props.onChange(i)}/>
          <ListButton
            name={this.props.categories[1].name}
            values={this.props.categories[1].values}
            onChange={(i) => this.props.onChange(i)}/>
          <ListButton
            name={this.props.categories[2].name}
            values={this.props.categories[2].values}
            onChange={(i) => this.props.onChange(i)}/>
        </div>
      </div>
    );
  }
}

export default SearchBar;
