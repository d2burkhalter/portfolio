import React, {Component} from 'react';
import './style.css';
import * as Constants from '../../Constants.js';
import checkimg from "../../images/white_check_2.png";
import ximg from "../../images/white_x_2.png";


//The individual reivews at the bottom of the item's page
class Review extends Component {
  //the state feels dirty I'll clean it up later
  constructor(props) {
    super(props);
    this.state = {
      name: props.info.bioInfo.name,
      infoArray: props.info.bioInfo.bioArray,
      fit: props.info.fit,
      pictureURL: props.info.pictureURL,
      date: props.info.reviewInfo.date,
      liked: props.info.reviewInfo.liked,
      reviewArray: props.info.reviewInfo.reviewArray,
    }
  }



  //makes the single line of biographical info
  generateBioLine(key, value) {
    return (
      <div className="BioLineContainer" key={key}>
        <div className="BioTitle">{key}:</div>
        <div className="BioInfo">{value}</div>
      </div>
    );
  }

  generateBioInfo() {
    var bioInfo = [];
    for(var key in this.state.infoArray) {
      if(key === Constants.HEIGHT_KEY) {
        bioInfo.push(this.generateBioLine(key, Constants.HEIGHT_LIST[this.state.infoArray[key]]));
      } else if(key === Constants.BRA_SIZE_KEY) {
        bioInfo.push(this.generateBioLine(key, Constants.BRA_SIZE_LIST[this.state.infoArray[key]]));
      } else {
        bioInfo.push(this.generateBioLine(key, this.state.infoArray[key]));
      }
    }

    return bioInfo;
  }
  generateFit(input) {
    return (
      <div className="FitContainer">
        <div className={(input === 0) ? "FitBox Selected" : "FitBox UnSelected"}>
          <div className="FitText">SMALL</div>
        </div>
        <div className={(input === 1) ? "FitBox Selected" : "FitBox UnSelected"}>
          <div className="FitText">TRUE</div>
        </div>
        <div className={(input === 2) ? "FitBox Selected" : "FitBox UnSelected"}>
          <div className="FitText">LARGE</div>
        </div>
      </div>
    );
  }
  //makes the biographical portion of the review
  generateBio(props) {

    var bioInfo = this.generateBioInfo();
    var fitQuality;
    switch(this.state.fit) {
      case 0:
        fitQuality = "Small";
        break;
      case 1:
        fitQuality = "True to size";
        break;
      case 2:
        fitQuality = "Large";
        break;
      default:
        fitQuality  = "Something went wrong";
        break;
    }

    return (
      <div className="BioContainer">
        <div className="BioTextBox">
          <div className="BioName">{props.name}</div>
            {bioInfo}
            <div className="BioLineContainer" key="fit">
              <div className="BioTitle">FIT:</div>
              <div className="BioInfo">{fitQuality}</div>
            </div>
        </div>
      </div>
    );
  }
  //makes the responses for the user comments
  generateResponseLine(info) {
    return (
      <div className="ReviewInfoContainer" key={info}>
        <div className="ReviewInfoTitle">{info[0]}</div>
        <div className="ReviewInfo">{info[1]}</div>
      </div>
    );
  }
  //makes the response section of the review
  generateResponse(props) {

    var reviewInfo = props.reviewArray.map(this.generateResponseLine);

    return (
      <div className="ReviewTextBox">
        <div className="ReviewTop">
          <div className="Date">{props.date}</div>
          <div className={(props.liked) ? "Circle Liked" : "Circle Disliked"}>
            <img className="ResponseIcon"
              src={(props.liked) ? checkimg : ximg}
              alt="meaningful text"
              />
          </div>
        </div>
        {reviewInfo}
      </div>
    );
  }

  render() {
    return (
      <div className="Review-Container">

        <div className="Review-Section">
          {this.generateBio(this.state)}
        </div>

        <div className="Review-Section">
          <img className="ReviewImage" src={this.state.pictureURL} alt=""/>
        </div>

        <div className="Review-Section">
          {this.generateResponse(this.state)}
        </div>

      </div>
    );
  }
}

export default Review;
