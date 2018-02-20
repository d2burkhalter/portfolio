import React, {Component} from 'react';
import './style.css';

class ListButton extends Component {
  //creates options from list of possible values
  createOptions(values) {
    var output= [];
    for (var i =0; i < values.length; i++) {
      //value is numerical representiation of item values[i] is text displayed
      output.push(<option key={i} value={i}>{values[i]}</option>);
    }
    return output;
  }
  render() {
    return (
      <select className="ListButton"
        name={this.props.name}
        onChange={this.props.onChange}>
        {this.createOptions(this.props.values)}
      </select>
    );
  }
}

export default ListButton;
