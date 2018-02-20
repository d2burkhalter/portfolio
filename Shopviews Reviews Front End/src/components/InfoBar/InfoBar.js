import React, {Component} from 'react';
import Satisfaction from '../Satisfaction/Satisfaction.js';
import BarGraph from '../BarGraph/BarGraph.js';
import './style.css';
//displays the information at top of the reviews
class InfoBar extends Component {
  //given the data on how the item fits and satisfaction
  constructor(props) {
    super(props);
    this.state = {
      fitData: props.fitData,
      satisfactionData: props.satisfactionData,
    }
  }

  render() {
    return (
      <div className="TopBar-Container">
        <div className="TopBar-Row">
          <Satisfaction
            percentage={this.state.satisfactionData.percentage}
            number={this.state.fitData.total}/>
          <BarGraph fitData={this.state.fitData}/>
        </div>
      </div>
    );
  }
}

export default InfoBar;
