import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Register.scss";
import { createNewUserService } from "../../services/userService";
import Navbar from "./Navbar";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            showPassword: false,
            errMessage: "",
        };
    }
    handleOnChangeInput = (e, id) => {
        let valueInput = e.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }

    handleRegister = async () => {
        this.setState({
            errMessage: "",
        });
        try {
            if (this.state.password === this.state.confirmPassword) {
                let data = await createNewUserService({
                    email: this.state.username,
                    password: this.state.password
                });
                console.log(data)
                // if (data && data.errCode !== 0) {
                //     this.setState({
                //         errMessage: data.message,
                //     });
                // }
                // if (data && data.errCode === 0) {
                //     this.props.userLoginSuccess(data.user);
                //     console.log("loging success");
                // }
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
            this.handleRegister();
        }
    }
    render() {
        return (
            <div className="register-background">
                <Navbar />
                <div className="register-container">
                    <div className="register-content">
                        <div className="register-form">
                            <h1>Register</h1>
                            <div className="group">
                                <input
                                    type="text"
                                    className="inputText register-input"
                                    placeholder=" "
                                    value={this.state.username}
                                    onChange={(e) => this.handleOnChangeInput(e, "username")}
                                />
                                <label>Username</label>
                            </div>
                            <div className="group">
                                <input
                                    type={this.state.showPassword ? "text" : "password"}
                                    className="inputText register-input"
                                    placeholder=" "
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangeInput(event, "password")}
                                // onKeyDown={(event) => this.handleKeyDown(event)}
                                />
                                <label>Password </label>
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
                            <div className="group">
                                <input
                                    type={this.state.showPassword ? "text" : "password"}
                                    className="inputText register-input"
                                    placeholder=" "
                                    value={this.state.confirmPassword}
                                    onChange={(event) => this.handleOnChangeInput(event, "confirmPassword")}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                />
                                <label>Password </label>

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
                            <button className="btn-register" onClick={() => this.handleRegister()}>
                                Register
                            </button>
                            <div className="err-message" style={{ color: "red" }}>
                                {
                                    this.state.password !== this.state.confirmPassword ?
                                        "Mật khẩu không khớp" :
                                        ""
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) =>
            dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
