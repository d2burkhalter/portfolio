import React, {Component} from 'react';
import './style.css';
//displays the bar showing what percentage of people thought of fit
function Bar(props) {
  return(
    <div className="BarContainer">
      <div className="ProgressBar horizontal">
        <div className="ProgressTrack">
          <div className="ProgressFill" style={{width:props.percentage+'%'}}>
          </div>
        </div>
      </div>
    </div>
  );
}
//container for the bar
function BarRow(props) {
  return (
    <div className="BarRow-Container">
      <div className="BarRow-Title">{props.name}</div>
      <Bar percentage={props.percentage}/>
      <div className="BarRow-Number">({props.number})</div>
    </div>
  );
}
//shows the bars graph of how the item fit
class BarGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitData: props.fitData,
    }
  }
  //given index and the fit data returns the percentage that thought
  //the item fit that way
  getPercentage(index, data) {
    let output = (data.fitArray[index]/data.total)*100;
    return output;
  }
  render() {
    return (
      <div className="BarGraph-Container">
        <div className="BarGraph-Title">FIT</div>
        <BarRow
          name="Small"
          number={this.state.fitData.fitArray[0]}
          percentage={this.getPercentage(0, this.state.fitData)}/>
        <BarRow
          name="True to size"
          number={this.state.fitData.fitArray[1]}
          percentage={this.getPercentage(1, this.state.fitData)}/>
        <BarRow
          name="Large"
          number={this.state.fitData.fitArray[2]}
          percentage={this.getPercentage(2, this.state.fitData)}/>
      </div>
    );
  }
}

export default BarGraph;
