import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as Constants from './Constants.js';

//list of possible pictures
const picsList=["https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/TXVR261Y8C.jpg",
"https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/GCJ7VU3PZ0.jpg","https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/72ZCJJ8K6I.jpg",
"https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/JXA18HVCW9.jpg","https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/G80N9Q8U4X.jpg",
"https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/TDIR8F5U65.jpg","https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/YBYMXZU8NP.jpg",
"https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/UMLWILXWPK.jpg","https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/JHP2ZW37XM.jpg"];

//list of possible names
const nameList = ["David","Ben","Jack","Nathalie",
"Seun", "Sylvia", "Hyeong"];
//returns a random number between given min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random()*(max-min+1)) + min;
}
//returns true or false
function coinFlip() {
  return Math.floor(Math.random()*2) === 0;
}
//returns a random name from given list
function randName() {
  return nameList[getRandomInt(0,nameList.length-1)];
}


//returns a possible biographcal info for a review
function generateBioArray() {
  //const bioItems = [];//list of all the bio info given

  const bioDict = {}; // dictionary of all the bio info

  //We always have the size they wore
  bioDict[Constants.SIZE_KEY] = getRandomInt(0,16);

  //75% chance of height entry
  if (getRandomInt(0,4) > 0) {
    bioDict[Constants.HEIGHT_KEY] = getRandomInt(0, Constants.HEIGHT_LIST.length - 1);
  }
  //75% chance of bra size entry
  if (getRandomInt(0,4) > 0) {
    bioDict[Constants.BRA_SIZE_KEY] = getRandomInt(0,Constants.BRA_SIZE_LIST.length-1);
  }
  //75% chance of age entry
  if (getRandomInt(0,4) > 0) {
    bioDict[Constants.AGE_KEY] = getRandomInt(15,50);;
  }
  //75% chance of weight entry
  if (getRandomInt(0,4) > 0) {
    bioDict[Constants.WEIGHT_KEY] = getRandomInt(100,200);
  }

  //console.log('Bio Items: ', bioItems);
  //console.log('Bio Dict: ', bioDict);

  return bioDict;
}
//returns a random picture url from given list
function generatePicture() {
  var number = getRandomInt(0,picsList.length-1);
  return picsList[number];
}
//returns a random date in Month Day, Year
function generateDate() {
  var date = "";
  const months = ["January", "Febuary", "March", "April", "May", "June",
  "July", "August", "September", "October", "November" ,"December"];
  date += months[getRandomInt(0, months.length - 1)];
  date += " " + getRandomInt(1,30) + ",";
  date += " " + getRandomInt(1900, 2100);
  return date;
}
//returns a possible user review
function generateReviewArray() {
  const reviewItems = [];
  //75% chance of saying where they wore it
  if (getRandomInt(0,4) > 0) {
    let entry = [];//entries have form [question,response]
    entry.push("WHERE DID YOU WEAR IT?");
    let wearArray = ["Prom", "Formal", "Wedding", "Birthday",
    "Dance", "Downtown", "Church"];
    entry.push(wearArray[getRandomInt(0, wearArray.length-1)]);
    reviewItems.push(entry);
  }
  //75% chance of them saying what they thought about it
  if (getRandomInt(0, 4) > 0) {
    let entry = [];
    entry.push("WHAT DID YOU THINK ABOUT IT?");
    let wordArray = ["I", "loved", "it", "so", "much", "favorite", "thing", "ever", "cute", "awesome", "fashion", "shopviews"]
    let words = "";
    for (var i = 0; i < getRandomInt(10,45); i++) {
      words += wordArray[getRandomInt(0, wordArray.length-1)] + " ";
    }
    entry.push(words);
    reviewItems.push(entry);
  }
  return reviewItems;
}
//returns a possible complete review
function generateReview(id) {
  //biographical information about user
  var bioInfo = {
    name: randName(),
    bioArray: generateBioArray(),
  }
  //url for their picture
  var pictureURL = generatePicture();
  //their text review
  var reviewInfo = {
    date: generateDate(),
    liked: coinFlip(),
    reviewArray: generateReviewArray(),
  }
  var review = {
    id: id,
    score: 0,
    fit: getRandomInt(0,2),
    bioInfo: bioInfo,
    pictureURL: pictureURL,
    reviewInfo: reviewInfo,
  }
  return review;
}
//returns list of all possible sizes
function generateSize(start,end) {
  var output = ["Size"];
  for (var i = start; i < end; i++) {
    output.push(i);
  }
  return output;
}
//returns list of all possible heights
function generateHeight() {
  var output =["Height"];
  for (var i = 4; i < 7; i++) {
    for (var j = 0; j < 12; j++) {
      output.push(i+"'"+j+"\"");
    }
  }
  return output;
}
//returns list of all possible bra sizes
function generateBraSize() {
  var output = ["Bra Size"];
  for (var i = 32; i < 39; i+=2) {
    output.push(i+"AA");
    output.push(i+"A");
    output.push(i+"B");
    output.push(i+"C");
    output.push(i+"D");
  }
  return output;
}
//returns list of all possible searchable biographical information
function generateCategories() {
  var output = [];
  output.push({
      type: "list",
      name: Constants.SIZE_KEY,
      values: generateSize(0,15)
    });
  output.push({
    type: "list",
    name: Constants.HEIGHT_KEY,
    values: generateHeight()
  });
  output.push({
    type: "list",
    name: Constants.BRA_SIZE_KEY,
    values: generateBraSize()
  });
  output.push({
    type: "numbers",
    name: Constants.AGE_KEY,
  });
  output.push({
    type: "numbers",
    name: Constants.WEIGHT_KEY,
  });
  return output;
}
//returns a list of reviews
function generateReviews(number) {
    var output = [];
    for (var i =0; i < number; i++) {
      output.push(generateReview(i));
    }
    return output;
}
//returns a possible JS object for the review section
function generate(number) {
  var reviews = generateReviews(number);
  var satisfied = 0;//total number satisfied
  var unsatisfied = 0;//total number unsatisfied
  var fitNum = [0,0,0];//total number with each fit [small,true,large]
  //iterates over reviews to see if they were satisfied and how it fit
  for (var i = 0; i < reviews.length; i++) {
    if (reviews[i].reviewInfo.liked) {
      satisfied++;
    } else {
      unsatisfied++;
    }
    fitNum[reviews[i].fit]++;
  }
  //total number of reviews
  var total = fitNum[0]+fitNum[1]+fitNum[2];
  //data for a possible item
  var data = {
    fitData: {
      total: total,
      fitArray: [fitNum[0],fitNum[1],fitNum[2]],
    },
    categories : generateCategories(),
    satisfactionData: {
      satisfied: satisfied,
      unsatisfied: unsatisfied,
      percentage: Math.round((satisfied/(satisfied+unsatisfied))*100),
    },
    reviews: reviews,
  }
  return data;
}

var testData = generate(50);
//local test data JSON
//var data = require("./prettydata.json");
//App is given prop data to passthrough data
ReactDOM.render(
  <App data={testData}/>,
  document.getElementById('root')
);
