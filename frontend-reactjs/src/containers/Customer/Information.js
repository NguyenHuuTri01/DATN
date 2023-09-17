import React, { Component } from "react";
import { connect } from "react-redux";
import { getUserById, editUserService } from '../../services/userService';
import './Information.scss';
import { toast } from "react-toastify";

class Information extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            address: '',
            phonenumber: '',
            password: '',
        }
    }
    async componentDidMount() {
        if (this.props.userInfo && this.props.userInfo.id) {
            let getUser = await getUserById(this.props.userInfo.id);
            if (getUser && getUser.errCode === 0) {
                this.setState({
                    email: getUser.data.email,
                    name: getUser.data.name ? getUser.data.name : "",
                    address: getUser.data.address ? getUser.data.address : "",
                    phonenumber: getUser.data.phonenumber ? getUser.data.phonenumber : "",
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            let getUser = await getUserById(this.props.userInfo.id);
            if (getUser && getUser.errCode === 0) {
                this.setState({
                    email: getUser.data.email,
                    name: getUser.data.name ? getUser.data.name : "",
                    address: getUser.data.address ? getUser.data.address : "",
                    phonenumber: getUser.data.phonenumber ? getUser.data.phonenumber : "",
                })
            }
        }
    }
    handleChange = (value) => {
        this.setState({
            value: value
        })
    }
    handleOnChangeInput = (e, id) => {
        let valueInput = e.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }
    updateInformation = async () => {
        let { email, name, address, phonenumber, password } = this.state;
        let resUpdate = await editUserService({
            id: this.props.userInfo.id,
            email: email,
            name: name,
            address: address,
            phonenumber: phonenumber,
            password: password
        })
        if (resUpdate && resUpdate.errCode === 0) {
            toast.success('Cập Nhật Thông Tin Thành Công!');
            this.setState({
                password: ''
            })
        } else
            if (resUpdate && resUpdate.errCode === -1) {
                toast.error('Sai Mật Khẩu!');
            }
    }

    render() {
        let { email, name, address, phonenumber, password } = this.state;
        return (
            <div className="information-customer-container">
                <div className="information-customer-form">
                    <div className="title-information">
                        Quản Lý Thông Tin
                    </div>
                    <div>
                        <div className="title-child">
                            Email:
                        </div>
                        <input
                            className="form-control"
                            placeholder="Email..."
                            defaultValue={email}
                            type="text"
                            disabled={true}
                            onChange={(e) => this.handleOnChangeInput(e, "email")}
                        />
                    </div>
                    <div>
                        <div className="title-child">
                            Tên:
                        </div>
                        <input
                            className="form-control"
                            placeholder="Tên..."
                            defaultValue={name}
                            type="text"
                            onChange={(e) => this.handleOnChangeInput(e, "name")}
                        />
                    </div>
                    <div>
                        <div className="title-child">
                            Địa Chỉ:
                        </div>
                        <input
                            className="form-control"
                            placeholder="Địa Chỉ..."
                            defaultValue={address}
                            type="text"
                            onChange={(e) => this.handleOnChangeInput(e, "address")}
                        />
                    </div>
                    <div>
                        <div className="title-child">
                            Số Điện Thoại:
                        </div>
                        <input
                            className="form-control"
                            placeholder="Số Điện Thoại..."
                            defaultValue={phonenumber}
                            type="number"
                            onChange={(e) => this.handleOnChangeInput(e, "phonenumber")}
                        />
                    </div>
                    <div>
                        <div className="title-child">
                            Xác Nhận Mật Khẩu:
                        </div>
                        <input
                            className="form-control"
                            placeholder="Mật Khẩu Hiện Tại..."
                            defaultValue={password}
                            type="password"
                            onChange={(e) => this.handleOnChangeInput(e, "password")}
                        />
                    </div>
                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={() => this.updateInformation()}
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

export default connect(mapStateToProps, mapDispatchToProps)(Information);
