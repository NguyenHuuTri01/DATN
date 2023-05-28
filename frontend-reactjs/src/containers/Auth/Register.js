import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Register.scss";
import { createNewUserService } from "../../services/userService";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import unorm from 'unorm';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            showPassword: false,
            errMessage: "",
            isShowLoading: false
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

    validateEmail = (email) => {
        const normalizedStr = unorm.nfkd(email);
        const regex = /[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF\u1EF0-\u1EFF]/;
        if (regex.test(normalizedStr)) {
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    handleRegister = async () => {
        this.setState({
            errMessage: "",
        });
        if (!this.validateEmail(this.state.username)) {
            alert("Vui lòng nhập email cho chính xác!")
            return
        }
        try {
            this.setState({
                isShowLoading: true
            })
            if (this.state.password === this.state.confirmPassword) {
                let data = await createNewUserService({
                    email: this.state.username,
                    password: this.state.password
                });
                if (data && data.errCode === 0) {
                    if (this.props.history) {
                        toast.success('Đăng kí tài khoản thành công!');
                        this.props.history.push(`/login`);
                    }
                } else {
                    toast.error('Something Wrongs....');
                }
            }
            this.setState({
                isShowLoading: false
            })
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
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <div className="register-container">
                        <div className="register-content">
                            <div className="register-form">
                                <h1>Đăng Ký</h1>
                                <div className="group">
                                    <input
                                        type="text"
                                        className="inputText register-input"
                                        placeholder=" "
                                        value={this.state.username}
                                        onChange={(e) => this.handleOnChangeInput(e, "username")}
                                    />
                                    <label>Email</label>
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
                                <div className="group">
                                    <input
                                        type={this.state.showPassword ? "text" : "password"}
                                        className="inputText register-input"
                                        placeholder=" "
                                        value={this.state.confirmPassword}
                                        onChange={(event) => this.handleOnChangeInput(event, "confirmPassword")}
                                        onKeyDown={(event) => this.handleKeyDown(event)}
                                    />
                                    <label>Nhập Lại Mật Khẩu </label>

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
                                    Đăng Ký
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
                </LoadingOverlay>
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
