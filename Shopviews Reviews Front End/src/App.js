import React, { Component } from 'react';
import InfoBar from './components/InfoBar/InfoBar.js';
import SearchBar from './components/SearchBar/SearchBar.js';
import ReviewSection from './components/ReviewSection/ReviewSection.js';
import * as Constants from './Constants.js';
import NavBar from './components/NavBar/NavBar.js';

import './App.css';

//Main app
class App extends Component {
  //constructed with all the data
  constructor(props) {
    super(props);
    var searchParams = {};
    searchParams[Constants.SIZE_KEY] = -1;
    searchParams[Constants.HEIGHT_KEY] = -1;
    searchParams[Constants.BRA_SIZE_KEY] = -1;

    this.state = {
      data: props.data,//all the items data
      counter: 0,//current index of top displayed review
      increment: 5,//how many reviews are displayed
      max: props.data.reviews.length,//total number of reviews
      upActive: false,//if you can still go up in reivews
      downActive: true,//if you can still go down in reviews
      searchParameters: searchParams,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onNavButtonClick = this.onNavButtonClick.bind(this);
  }

  scoreReviews() {
    var currentParams = this.state.searchParameters;
    var currentReviews = this.state.data.reviews;
    var currentData = this.state.data;
    //penalty for not having the parameter
    var penalty = 5;

    //iterates over reviews to assign them a score
    for(var i = 0; i < currentReviews.length; i++) {
      var diff = 0;
      var currentReview = currentReviews[i].bioInfo.bioArray;

      for(var key in currentParams) {
        var input = currentParams[key];
        var reviewData = currentReview[key];
        if(input > -1 && reviewData != null) {
          diff += Math.abs(input - reviewData);
        }
        if (!(reviewData != null)) {
          diff += penalty;
        }
      }

      //changes score in current review
      currentReviews[i].score = diff;
    }
    //changes data in currentData
    currentData.reviews = currentReviews;
    //saves changes in state
    this.setState({
      data: currentData
    });
  }

  //sorts reviews by search parameters
  sortReviews() {
    this.scoreReviews();
    this.state.data.reviews.sort(function(review1, review2) {
      if (review1.score < review2.score) {
        return -1;
      }
      if (review1.score > review2.score) {
        return 1;
      }
      return 0;
    });
  }

  handleInputChange(event) {

    var currentTarget = event.target.name;
    var currentValue = event.target.value;
    var currentParams = this.state.searchParameters;

    currentParams[currentTarget] = currentValue - 1;

    this.setState({
      searchParameters: currentParams
    });

    this.sortReviews();
  }
  //what happens when a navigation button is clicked
  onNavButtonClick(dir) {
    var currentCounter = this.state.counter; //current index of top displayed
    var currentIncrement = this.state.increment; //how far each step is
    //if moving up in list
    if (dir === 0 && this.state.upActive) {
      currentCounter-=currentIncrement;
      //checks if trying to go below 0 index
      if (currentCounter <= 0) {
        this.setState({
          counter: 0,
          upActive: false,
        });
      } else {
        this.setState({
          counter: currentCounter,
        });
      }
      this.setState({
        downActive: true,
      });
    //if moving down in list
    } else if (dir === 1 && this.state.downActive) {
      currentCounter += currentIncrement;
      //checks if trying to go higher than number of reviews
      if (currentCounter >= this.state.max-currentIncrement) {
        this.setState({
          counter: this.state.max-currentIncrement,
          downActive: false,
        });
      } else {
        this.setState({
          counter: currentCounter,
        });
      }
      this.setState({
        upActive: true,
      });
    }
  }
  //displays state of App
  verifyStuff() {
    console.log(this.state);
  }

  render() {
    return (
      <div className="App">
        <div className="MainContainer">

          <div className="Container">

            <InfoBar
              fitData={this.state.data.fitData}
              satisfactionData={this.state.data.satisfactionData}/>

            <SearchBar
              categories={this.state.data.categories}
              onChange={(i) => this.handleInputChange(i)}/>

            <ReviewSection
              reviewArray={this.state.data.reviews}
              counter={this.state.counter}
              increment={this.state.increment}/>

            <NavBar upActive={this.state.upActive}
              downActive={this.state.downActive}
              onClick={(i) => this.onNavButtonClick(i)}/>

          </div>

        </div>
      </div>
    );
  }
}

export default App;
