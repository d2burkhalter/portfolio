import React, {Component} from 'react';
import Review from '../Review/Review.js';
import './style.css';
//contains all of the individual reviews
class ReviewSection extends Component {
  //given array of user reviews
  /**constructor(props) {
    super(props);
    this.state = {
      reviewArray: props.reviewArray,
      counter: props.counter,
    }
  }**/
  //given info a single review returns the Review object
  generateReview(info) {
    return (
      <Review info={info} key={info.id}/>
    )
  }
  //maps the review array to review objects to be displayed
  displayReviews(reviewArray, start) {
    var reviews = reviewArray.map(this.generateReview);

    var shown;
    if (reviews.length > start + this.props.increment) {
      shown = reviews.slice(start, start+ this.props.increment);
    } else {
      var max = reviews.length;
      shown = reviews.slice(start, max);
    }

    return(
    <div className="ReviewSection-Container">
      {shown}
    </div>
    );
  }

  render() {
    return (
      <div>
        {this.displayReviews(this.props.reviewArray, this.props.counter)}
      </div>
    );
  }
}

export default ReviewSection;
