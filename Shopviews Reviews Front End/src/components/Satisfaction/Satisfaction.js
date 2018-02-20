import React, {Component} from 'react';
import './style.css';
//displays how satisfied reviewers are with item
class Satisfaction extends Component {
  //given data on satisfaction
  constructor(props) {
    super(props);
    this.state = {
      percentage: props.percentage,
      number: props.number
    }
  }
  render() {
    return (
      <div className="Satisfaction-Container">
        <div className="Satisfaction-TextContainer">
          <div className="Percentage">{this.state.percentage}%</div>
          <div className="Percentage-Text">SATISFACTION</div>
          <div className="Review-Number">{this.state.number} Reviews</div>
        </div>
      </div>
    );
  }
}

export default Satisfaction;
