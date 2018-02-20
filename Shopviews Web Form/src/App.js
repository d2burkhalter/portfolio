import React, { Component } from 'react';
import './App.css';

function FitButton(props) {
  return (
    <div className={(props.isSelected) ? "FtiSelected" : "FitNotSelected"} onClick={() => props.onClick()}>
      {props.name}
    </div>
  );
}

class FitContainer extends React.Component {

  renderFitButton(i, text) {
      return <FitButton key={i+"btn"} value={i} name={text} isSelected={(this.props.currentSelected === i)} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div className="FitButton-row">
      <div className="FitButton-container">
        {this.renderFitButton(1, "Too Small")}
      </div>
      <div className="FitButton-button">
        {this.renderFitButton(2, "Just Right")}
      </div>
      <div className="FitButton-button">
        {this.renderFitButton(3, "Too Large")}
      </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitClicked: 2,
      normalsize: "6",
      fitcomment: "Say something",
      userpicture: "",
      questionComment: "Anything else",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
  }

  handleFitClick(i) {
    if (i !== this.state.fitClicked) {
      this.setState({
        fitClicked: i,
      });
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FitContainer
        currentSelected={this.state.fitClicked}
        onClick={(i) => this.handleFitClick(i)}
        />
        <label>
          What did you like about it?
        </label>
        <textarea
          name="fitcomment"
          value={this.state.fitcomment}
          onChange={this.handleInputChange}/>
        <label>
          What size do you normally wear?
        </label>
        <select
          name="normalsize"
          value={this.state.normalsize}
          onChange={this.handleInputChange}>
            <option value="0">0</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
        </select>
        <label>
          Add a picture
        </label>
        <input type="file" name="userpicture" accept="image/*"/>
        <label>
          Questions or comments
        </label>
        <textarea
          name="questionComment"
          value={this.state.questionComment}
          onChange={this.handleInputChange}/>

        <input type="submit" value="Submit"/>
      </form>
    );
  }
}

export default App;
