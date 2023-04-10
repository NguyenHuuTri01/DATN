import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import Description from "./Description";
// import "./HomePage.scss";

class HomePage extends Component {
  render() {
    return (
      <div className="homepage-container">
        <HomeHeader />
        {/* <Description /> */}
        {/* <HomeFooter /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
