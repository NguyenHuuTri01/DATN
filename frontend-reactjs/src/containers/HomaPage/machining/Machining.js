import React, { Component } from "react";
import { connect } from "react-redux";
import './Machining.scss';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { submitForm } from '../../../services/userService';
import { toast } from "react-toastify";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import unorm from 'unorm';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 1.5,
    px: 4,
    pb: 1,
};

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
        const normalizedStr = unorm.nfkd(email);
        const regex = /[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF\u1EF0-\u1EFF]/;
        if (regex.test(normalizedStr)) {
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    validatePhoneNumber = (phoneNumber) => {
        const phoneNumberRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        return phoneNumberRegex.test(phoneNumber);
    }
    handleSubmit = async () => {
        let { customerName, address, phonenumber, email, loaiCongTrinh, dientich, require
        } = this.state;
        if (!this.props.isLoggedIn) {
            alert("Đăng nhập để thuê gia công")
            return
        }
        if (!customerName || !address || !phonenumber || !email || !loaiCongTrinh
            || !dientich) {
            alert("Vui lòng điền đầy đủ thông tin")
            return
        }
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
            require: require,
            userId: this.props.userInfo.id,
            paintPackId: this.props.paintPackId
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
                require: '',
            })
            this.props.getListSubmit();
            this.props.closeRent();
        }

    }

    render() {
        return (
            <Modal
                open={this.props.openRent}
                onClose={() => this.props.closeRent()}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
                className="modal-abc"
            >
                <Box sx={{ ...style, width: 900, height: 700, overflow: 'auto' }}>
                    <div className="machining-content">
                        <div className="panner">
                            **Bạn muốn thuê gia công, hãy điền vào form ở dưới, chúng tôi
                            sẽ liên hệ bạn sớm nhất, chân thành cảm ơn**
                        </div>
                        <div className="machining-input">
                            <div className="machining-item">
                                <label>Họ tên khách hàng
                                    <label style={{ color: "red", fontSize: "20px" }}>*</label>
                                </label>
                                <input
                                    value={this.state.customerName}
                                    className="form-control"
                                    placeholder="Nhập họ tên ..."
                                    onChange={(e) => this.handleChangeInput(e, 'customerName')}
                                />
                            </div>
                            <div className="machining-item">
                                <label>Địa chỉ
                                    <label style={{ color: "red", fontSize: "20px" }}>*</label>
                                </label>
                                <TextareaAutosize
                                    className="form-control"
                                    minRows={3}
                                    placeholder="Nhập địa chỉ ..."
                                    value={this.state.address}
                                    onChange={(e) => this.handleChangeInput(e, 'address')}
                                />
                            </div>
                            <div className="machining-item">
                                <label>Số điện thoại
                                    <label style={{ color: "red", fontSize: "20px" }}>*</label>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Nhập số điện thoại ..."
                                    value={this.state.phonenumber}
                                    onChange={(e) => this.handleChangeInput(e, 'phonenumber')}
                                />
                            </div>
                            <div className="machining-item">
                                <label>Email
                                    <label style={{ color: "red", fontSize: "20px" }}>*</label>
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập email ..."
                                    value={this.state.email}
                                    onChange={(e) => this.handleChangeInput(e, 'email')}
                                />
                            </div>
                            <div className="machining-item">
                                <label>Loại công trình
                                    <label style={{ color: "red", fontSize: "20px" }}>*</label>
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập loại công trình ..."
                                    value={this.state.loaiCongTrinh}
                                    onChange={(e) => this.handleChangeInput(e, 'loaiCongTrinh')}
                                />
                            </div>
                            <div className="machining-item">
                                <label>Diện tích
                                    <label style={{ color: "red", fontSize: "20px" }}>*</label>
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập diện tích ..."
                                    value={this.state.dientich}
                                    onChange={(e) => this.handleChangeInput(e, 'dientich')}
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
                        </div>
                    </div>
                    <button
                        className="btn btn-secondary btn-send"
                        onClick={() => this.props.closeRent()}
                    >Thoát</button>
                    <button
                        className="btn btn-primary btn-send"
                        onClick={() => this.handleSubmit()}
                    >Gửi yêu cầu</button>
                </Box>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Machining);
