import React, { Component } from "react";
import { connect } from "react-redux";
import { changePassword } from "../../services/userService";
import { toast } from "react-toastify";
import './ChangePassword.scss';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            newPassword: '',
            confirmPassword: '',
            showPassword: false,
            showNewPassword: false,
            showConfirmPassword: false,
            userId: 0
        }
    }
    async componentDidMount() {
        if (this.props.userInfo && this.props.userInfo.id) {
            this.setState({
                userId: this.props.userInfo.id
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.setState({
                userId: this.props.userInfo.id
            })
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            showPassword: !this.state.showPassword,
        })
    }
    handleShowHideNewPassword = () => {
        this.setState({
            showNewPassword: !this.state.showNewPassword,
        })
    }
    handleShowHideConfirmPassword = () => {
        this.setState({
            showConfirmPassword: !this.state.showConfirmPassword,
        })
    }
    handleOnChangeInput = (e, id) => {
        let valueInput = e.target.value;
        let stateCopy = { ...this.state }
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }
    handleChangePassword = async () => {
        let { password, newPassword, confirmPassword, userId } = this.state;
        if (newPassword === confirmPassword) {
            let resChangePassword = await changePassword({
                userId: userId,
                password: password,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            })
            if (resChangePassword && resChangePassword.errCode === 0) {
                toast.success('Đổi mật khẩu thành công!');
                this.setState({
                    password: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            } else
                if (resChangePassword && resChangePassword.errCode === -1) {
                    toast.error('Sai mật khẩu!');
                }
        } else {
            alert("Mật khẩu không trùng khớp")
        }
    }
    render() {
        let { showPassword, showNewPassword, showConfirmPassword } = this.state;
        return (
            <div className="change-password-container">
                <div className="change-password-form">
                    <div className="change-password-title">
                        Đổi Mật Khẩu
                    </div>
                    <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                        <InputLabel style={{ fontSize: "15px" }}>
                            Mật khẩu hiện tại
                        </InputLabel>
                        <Input
                            value={this.state.password}
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => this.handleOnChangeInput(e, "password")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        tabIndex={-1}
                                        aria-label="toggle password visibility"
                                        onClick={() => this.handleShowHidePassword()}
                                    >
                                        {!showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                        <InputLabel style={{ fontSize: "15px" }}>
                            Mật khẩu mới
                        </InputLabel>
                        <Input
                            value={this.state.newPassword}
                            type={showNewPassword ? 'text' : 'password'}
                            onChange={(e) => this.handleOnChangeInput(e, "newPassword")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        tabIndex={-1}
                                        aria-label="toggle new password visibility"
                                        onClick={() => this.handleShowHideNewPassword()}
                                    >
                                        {!showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl
                        sx={{ m: 1, width: '100%' }}
                        variant="standard"
                    >
                        <InputLabel style={{ fontSize: "15px" }}>
                            Nhập lại mật khẩu mới
                        </InputLabel>
                        <Input
                            value={this.state.confirmPassword}
                            type={showConfirmPassword ? 'text' : 'password'}
                            onChange={(e) => this.handleOnChangeInput(e, "confirmPassword")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        tabIndex={-1}
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => this.handleShowHideConfirmPassword()}
                                    >
                                        {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <label className="notification-confirm">
                        {
                            this.state.newPassword !== this.state.confirmPassword ? "Mật khẩu không khớp" : " "
                        }
                    </label>
                    <div>
                        <button
                            className="btn btn-primary btn-change-password"
                            onClick={() => this.handleChangePassword()}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
