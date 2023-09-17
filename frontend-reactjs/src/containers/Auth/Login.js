import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { handleLoginApi } from "../../services/userService";
import Navbar from "./Navbar";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import unorm from 'unorm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showPassword: false,
      errMessage: "",
      isOpenModal: false,
      email: ''
    };
  }

  handleOnChangeUserName = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  handleOnChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  handleLogin = async () => {
    this.setState({
      errMessage: "",
    });
    try {
      let data = await handleLoginApi(this.state.username, this.state.password);
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
        console.log("loging success");
      }
    } catch (e) {
      if (e.response) {
        if (e.response.data) {
          this.setState({
            errMessage: e.response.data.message,
          });
        }
      }
      console.log("error message", e.response);
    }
  };

  handleShowHidePassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.handleLogin();
    }
  }
  handleOpen = () => {
    this.setState({
      isOpenModal: true
    })
  }
  handleClose = () => {
    this.setState({
      isOpenModal: false
    })
  }
  handleOnChangeEmail = (e) => {
    this.setState({
      email: e.target.value
    })
  }
  validateEmail = (email) => {
    const normalizedStr = unorm.nfkd(email);
    const regex = /[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF\u1EF0-\u1EFF]/;
    if (regex.test(normalizedStr)) {
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  handleForgotPassword = () => {
    if (!this.validateEmail(this.state.email)) {
      alert("Email không hợp lệ")
    } else {

    }
  }
  render() {

    return (
      <div className="login-background">
        <Navbar />
        <div className="login-container">
          <div className="login-content">
            <div className="login-form">
              <h1>Đăng Nhập</h1>
              <div className="group">
                <input
                  type="text"
                  className="inputText login-input"
                  placeholder=" "
                  value={this.state.username}
                  onChange={(e) => this.handleOnChangeUserName(e)}
                />
                <label>Email</label>
              </div>

              <div className="group">
                <input
                  type={this.state.showPassword ? "text" : "password"}
                  className="inputText login-input"
                  placeholder=" "
                  value={this.state.password}
                  onChange={(event) => this.handleOnChangePassword(event)}
                  onKeyDown={(event) => this.handleKeyDown(event)}
                />
                <label>Mật Khẩu </label>

                <span onClick={() => this.handleShowHidePassword()}>
                  <i
                    className={
                      this.state.showPassword
                        ? "fas fa-eye show-password"
                        : "fas fa-eye-slash show-password"
                    }
                  ></i>
                </span>
              </div>
              <div
                className="forgot-password"
                onClick={() => this.handleOpen()}
              >
                <label>Quên mật khẩu</label>
              </div>
              <button className="btn-login" onClick={() => this.handleLogin()}>
                Đăng Nhập
              </button>
              <div className="err-message" style={{ color: "red" }}>
                {this.state.errMessage}
              </div>
            </div>

          </div>
        </div>
        <Modal
          open={this.state.isOpenModal}
          onClose={() => this.handleClose()}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              Nhập email của bạn để tiến hành khôi phục tài khoản
            </Typography>
            <input
              type="text"
              style={{
                width: "100%", outline: "none", margin: "20px 0",
                border: "1px solid #333"
              }}
              value={this.state.email}
              onChange={(e) => this.handleOnChangeEmail(e)}
              className="form-control input-forgot-password"
            />
            <Button
              style={{ backgroundColor: "#19A7CE", color: "#fff" }}
              onClick={() => this.handleForgotPassword()}
            >Khôi phục</Button>
          </Box>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
