import React, {Component} from 'react';
import './style.css';

class SearchButton extends Component {
  constructor(props) {
    super(props);
    this.state={
      name: props.name,
    }
  }
  render() {
    return (
      <div className="SearchButton-Container" onClick={() => this.props.onClick(this.props.name)}>
        <div className="SearchButton-text">{this.state.name}</div>
        <div className="SearchButton-icon"></div>
      </div>
    );
  }
}

export default SearchButton;
