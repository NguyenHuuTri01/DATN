import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import PaintManage from "../containers/System/PaintManage";
import Header from "../containers/Header/Header";
import DanhMucHang from "../containers/System/DanhMucHang";
import ManageUser from '../containers/System/Admin/ManageUser';
import ListOrder from "../containers/System/Statistical/ListOrder";
import InformationPaint from "../containers/System/InformationPaint";

class System extends Component {
  render() {
    const { systemMenuPath, isLoggedIn } = this.props;
    return (
      <React.Fragment>
        {isLoggedIn && <Header />}
        <div className="system-container">
          <div className="system-list">
            <Switch>
              <Route path="/system/danh-muc-hang" component={DanhMucHang} />
              <Route path="/system/manage-paint" component={PaintManage} />
              <Route path="/system/manage-user" component={ManageUser} />
              <Route path="/system/list-order" component={ListOrder} />
              <Route path="/system/information-paint" component={InformationPaint} />
              <Route
                component={() => { return <Redirect to={systemMenuPath} /> }}
              />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
