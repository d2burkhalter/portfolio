import React, {Component} from 'react';
import './style.css';

class TextButton extends Component {

  render() {
    return (
      <input
        type="text"
        className="TextButton"
        name={this.props.name}
        value={this.props.name}
        />
    )
  }
}

export default TextButton;
