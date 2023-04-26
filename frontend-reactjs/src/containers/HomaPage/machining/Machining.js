import React, { Component } from "react";
import { connect } from "react-redux";
import './Machining.scss';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { submitForm } from '../../../services/userService';
import { toast } from "react-toastify";

class Machining extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerName: '',
            address: '',
            phonenumber: '',
            email: '',
            loaiCongTrinh: '',
            dientich: '',
            color: '',
            startDate: '',
            endDate: '',
            require: '',
            listGiaCong: [],
        }
    }
    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleChangeInput = (e, id) => {
        let valueInput = e.target.value;
        let coppyState = { ...this.state };
        coppyState[id] = valueInput;
        this.setState({
            ...coppyState
        })
    }
    validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    validatePhoneNumber = (phoneNumber) => {
        const phoneNumberRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        return phoneNumberRegex.test(phoneNumber);
    }
    handleSubmit = async () => {
        let { customerName, address, phonenumber, email, loaiCongTrinh, dientich, color,
            startDate, endDate, require
        } = this.state;
        if (!this.validateEmail(email)) {
            alert("email sai định dạng")
            return
        }
        if (!this.validatePhoneNumber(phonenumber)) {
            alert("số điện thoại không tồn tại")
            return
        }

        let resSubmit = await submitForm({
            customerName: customerName,
            address: address,
            phonenumber: phonenumber,
            email: email,
            loaiCongTrinh: loaiCongTrinh,
            dientich: dientich,
            color: color,
            startDate: startDate,
            endDate: endDate,
            require: require,
            userId: this.props.userInfo.id
        });
        if (resSubmit && resSubmit.errCode === 0) {
            toast.success('Gởi yêu cầu thành công!');
            this.setState({
                customerName: '',
                address: '',
                phonenumber: '',
                email: '',
                loaiCongTrinh: '',
                dientich: '',
                color: '',
                startDate: '',
                endDate: '',
                require: '',
            })
        }

    }

    render() {
        return (
            <div className="machining-container">
                <div className="machining-content">
                    <div className="machining-title">Thuê Gia Công</div>
                    <div className="panner">
                        **Bạn muốn thuê gia công, hãy điền vào form ở dưới, chúng tôi
                        sẽ liên hệ bạn sớm nhất, chân thành cảm ơn**
                    </div>
                    <div className="machining-input">
                        <div className="machining-item">
                            <label>Họ tên khách hàng</label>
                            <input
                                value={this.state.customerName}
                                className="form-control"
                                placeholder="Nhập họ tên ..."
                                onChange={(e) => this.handleChangeInput(e, 'customerName')}
                            />
                        </div>
                        <div className="machining-item">
                            <label>Địa chỉ</label>
                            <TextareaAutosize
                                className="form-control"
                                minRows={3}
                                placeholder="Nhập địa chỉ ..."
                                value={this.state.address}
                                onChange={(e) => this.handleChangeInput(e, 'address')}
                            />
                        </div>
                        <div className="machining-item">
                            <label>Số điện thoại</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Nhập số điện thoại ..."
                                value={this.state.phonenumber}
                                onChange={(e) => this.handleChangeInput(e, 'phonenumber')}
                            />
                        </div>
                        <div className="machining-item">
                            <label>Email</label>
                            <input
                                className="form-control"
                                placeholder="Nhập email ..."
                                value={this.state.email}
                                onChange={(e) => this.handleChangeInput(e, 'email')}
                            />
                        </div>
                        <div className="machining-item">
                            <label>Loại công trình</label>
                            <input
                                className="form-control"
                                placeholder="Nhập loại công trình ..."
                                value={this.state.loaiCongTrinh}
                                onChange={(e) => this.handleChangeInput(e, 'loaiCongTrinh')}
                            />
                        </div>
                        <div className="machining-item">
                            <label>Diện tích</label>
                            <input
                                className="form-control"
                                placeholder="Nhập diện tích ..."
                                value={this.state.dientich}
                                onChange={(e) => this.handleChangeInput(e, 'dientich')}
                            />
                        </div>
                        <div className="machining-item">
                            <label>Màu sơn mong muốn</label>
                            <input
                                className="form-control"
                                placeholder="Nhập màu sơn mong muốn ..."
                                value={this.state.color}
                                onChange={(e) => this.handleChangeInput(e, 'color')}
                            />
                        </div>
                        <div className="machining-item">
                            <label>Ngày bắt đầu dự án</label>
                            <input
                                className="form-control"
                                placeholder="Nhập ngày bắt đầu ..."
                                value={this.state.startDate}
                                onChange={(e) => this.handleChangeInput(e, 'startDate')}
                            />
                        </div>
                        <div className="machining-item">
                            <label>Ngày hoàn thành dự án</label>
                            <input
                                className="form-control"
                                placeholder="Nhập ngày kết thúc ..."
                                value={this.state.endDate}
                                onChange={(e) => this.handleChangeInput(e, 'endDate')}
                            />
                        </div>
                        <div className="machining-item">
                            <label>Yêu cầu đặc biệt (nếu có)</label>
                            <TextareaAutosize
                                className="form-control"
                                minRows={5}
                                placeholder="Nhập yêu cầu ..."
                                value={this.state.require}
                                onChange={(e) => this.handleChangeInput(e, 'require')}
                            />
                        </div>
                        <div className="machining-item">
                            <button
                                className="btn btn-primary"
                                onClick={() => this.handleSubmit()}
                            >Gửi Yêu Cầu</button>
                        </div>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Machining);
