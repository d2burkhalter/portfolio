import React, {Component} from 'react';
import './style.css';
import logoimg from "../../images/Shopviews_logo.jpg";
class NavBar extends Component {


  render() {
    return (
      <div className="Bottom-Container">
      <div className="Logo-Container">
        <a href="https://shopviews.co">
          <img className="Logo" src={logoimg}/>
        </a>
        <div className="LogoText-Container">
          <div className="LogoText">powered by shopviews</div>
        </div>
      </div>
      <div className="NavBar-Container">
        <div className={(this.props.upActive) ? "NavButton Left Active" : "NavButton Left Inactive"}
          onClick={() => this.props.onClick(0)}>
            ←
        </div>
        <div className={(this.props.downActive) ? "NavButton Right Active" : "NavButton Right Inactive"}
          onClick={() => this.props.onClick(1)}>
            →
        </div>
      </div>
      </div>
    );
  }
}

export default NavBar;
