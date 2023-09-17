import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";
import { path } from "../utils";
import Home from "../routes/Home";
import Login from "./Auth/Login";
import System from "../routes/System";
import HomePage from "./HomaPage/HomePage";
import Register from "./Auth/Register";
import CustomScrollbars from "../components/CustomScrollbars";
import VerifyAccount from "./Auth/VerifyAccount";
import AccountManagement from "./Customer/AccountManagement";
import VerifyOrder from "./Auth/VerifyOrder";
import Detail from "./HomaPage/products/Detail";
import VerifyForgotPassword from "./Auth/VerifyForgotPassword";

class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <div className="content-container">
              <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <Switch>
                  <Route path={path.HOME} exact component={Home} />
                  <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                  <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                  <Route path={path.HOMEPAGE} component={HomePage} />
                  <Route path={'/register'} component={Register} />
                  <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                  <Route path={'/verify-account'} component={VerifyAccount} />
                  <Route path={'/verify-order'} component={VerifyOrder} />
                  <Route path={'/forgot-password'} component={VerifyForgotPassword} />
                  <Route path={'/account-management'} component={AccountManagement} />
                  <Route path={'/detail/:id'} component={Detail} />
                </Switch>
              </CustomScrollbars>
            </div>

            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
