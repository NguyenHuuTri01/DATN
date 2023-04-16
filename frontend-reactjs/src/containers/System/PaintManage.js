import React, { Component } from "react";
import { connect } from "react-redux";
import "./PaintManage.scss";

class PaintManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async componentDidMount() {
  }


  render() {
    return (
      <div className="paint-container">
        <div>
          tên
        </div>
        <div>
          ảnh
        </div>
        <div>
          giá tiền
        </div>
        <div>
          mô tả
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PaintManage);
