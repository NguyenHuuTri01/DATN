import React, { Component } from "react";
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Paypal from "./Paypal";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
    updateStatusCart, createPaypal, updatePaypal,
    deletePaypal, saveInforOrder, createCashOnReceipt,
    getUserById
} from '../../../services/userService';
import './ModalPayment.scss';
import _ from "lodash";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
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
    pt: 2,
    px: 4,
    pb: 3,
};
class ModalPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            methodPayment: "shipcod",
            name: '',
            email: '',
            address: '',
            phonenumber: '',
            isDisable: true,
            isShowLoading: false
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
    handleOpen = () => {
        if (window.confirm(`Bạn chắc chắn mua những màu vừa chọn chứ!!!`)) {
            this.setState({
                isOpen: true
            })
        } else {
            // xử lý khi chọn No
        }
    }
    handleClose = () => {
        this.setState({
            isOpen: false,
            methodPayment: "shipcod",
            isUpdateInfor: false,
        })
        this.props.handleClose();
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
    handlePayment = (e) => {
        this.setState({
            methodPayment: e.target.value,
        })
    }
    getDataStore = () => {
        this.props.getDataStore();
    }
    completeOrder = async () => {
        let { listPainBucket } = this.props;
        if (listPainBucket && listPainBucket.length > 0) {
            listPainBucket.map(async (item) => (
                await updateStatusCart({
                    userId: item.userId,
                    paintId: item.paintId,
                    status: 'complete'
                })
            ))
        }
    }
    createDataFakePaypal = async () => {
        let { listPainBucket } = this.props;
        if (listPainBucket && listPainBucket.length > 0) {
            let res = await createPaypal(listPainBucket)
            return res;
        }
    }
    deleteDataFakePaypal = async () => {
        let { listPainBucket } = this.props;
        if (listPainBucket && listPainBucket.length > 0) {
            let res = await deletePaypal(listPainBucket)
            return res;
        }
    }
    saveHistory = async (dataPaypal) => {
        let { listPainBucket } = this.props;
        if (listPainBucket && listPainBucket.length > 0) {
            listPainBucket.map((item) => {
                let date = new Date(dataPaypal.create_time)
                let timestamp = date.getTime() / 1000;
                item['transactionId'] = dataPaypal.id
                item['payerEmail'] = dataPaypal.payer.email_address
                item['paymentStatus'] = dataPaypal.status
                item['paymentAmount'] = dataPaypal.purchase_units[0].amount.value
                item['currencyCode'] = dataPaypal.purchase_units[0].amount.currency_code
                item['paymentDate'] = timestamp
                return item
            })
            await updatePaypal(listPainBucket)
            await saveInforOrder({
                userId: this.props.userInfo.id,
                userName: this.state.name,
                transactionId: dataPaypal.id,
                email: this.state.email,
                address: this.state.address,
                phonenumber: this.state.phonenumber,
                typePayment: 'paypal'
            })
        }
    }

    onchangeInput = (e, id) => {
        let valueinput = e.target.value;
        let coppyState = { ...this.state };
        coppyState[id] = valueinput;
        this.setState({
            ...coppyState,
        })
    }
    confirmInformation = () => {
        let { name, address, email, phonenumber, isDisable } = this.state;
        if (!name || !address || !email || !phonenumber) {
            alert("Vui lòng nhập đầy đủ thông tin")
        } else if (!this.validateEmail(email)) {
            alert("Email không hợp lệ")
        } else if (!this.validatePhoneNumber(phonenumber)) {
            alert("Số điện thoại không hợp lệ")
        } else {
            this.setState({
                isDisable: !isDisable,
            })
        }
    }

    paymentCashOnReceipt = async () => {
        let { listPainBucket } = this.props;
        this.setState({
            isOpen: false,
            isShowLoading: true
        })
        if (listPainBucket && listPainBucket.length > 0) {
            listPainBucket.map((item) => {
                item['email'] = this.state.email
                item['address'] = this.state.address
                item['phonenumber'] = this.state.phonenumber
                item['userName'] = this.state.name
                return item
            })
        }
        let resOrder = await createCashOnReceipt(listPainBucket);
        if (resOrder && resOrder.errCode === 0) {
            listPainBucket.map(async (item) => (
                await updateStatusCart({
                    userId: item.userId,
                    paintId: item.paintId,
                    status: 'complete'
                })
            ))
            await this.props.getDataStore();
            await this.handleClose();
            toast.success("Vui Lòng Xác Nhận Email Để Hoàn Tất Quá Trình Đặt Hàng")
        } else if (resOrder && resOrder.errCode === -2) {
            await this.props.getDataStore();
            this.handleClose();
            toast.error(
                "Đặt Hàng Thất Bại, Có Lẻ Số Lượng Không Đủ Đáp Ứng Cho Nhu Cầu Của Bạn"
            )
        } else if (resOrder && resOrder.errCode === -1) {
            // this.handleClose();
            toast.error(
                "Có Gì Đó Không Đúng Với Email Của Bạn"
            )
        }
        this.setState({
            isShowLoading: false
        })
    }

    render() {
        let { isOpen, methodPayment, isShowLoading } = this.state;
        let { listPainBucket, calculateTotal } = this.props;
        return (
            <>
                <LoadingOverlay
                    active={isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <Button
                        className="btn-payment"
                        onClick={() => this.handleOpen()}
                        disabled={
                            _.isEmpty(listPainBucket) || calculateTotal === 0 ?
                                true : false
                        }
                    >Đặt Hàng</Button>

                    <Modal
                        open={isOpen}
                        onClose={() => this.handleClose()}
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                    >
                        <Box sx={{ ...style, width: 900, height: 700 }}>
                            <div style={{ margin: "10px 0", color: "red" }}>
                                Mẹo: cập nhật thông tin cá nhân để rút ngắn thời gian mua hàng
                            </div>
                            <div>
                                <label>Tên</label>
                                <input
                                    className="form-control md-4"
                                    type="text"
                                    value={this.state.name}
                                    onChange={(e) => this.onchangeInput(e, 'name')}
                                    disabled={!this.state.isDisable}
                                />
                                <label>Email</label>
                                <input
                                    className="form-control md-4"
                                    type="email"
                                    value={this.state.email}
                                    onChange={(e) => this.onchangeInput(e, 'email')}
                                    disabled={!this.state.isDisable}
                                />
                                <label>Địa Chỉ</label>
                                <input
                                    className="form-control md-4"
                                    type="text"
                                    value={this.state.address}
                                    onChange={(e) => this.onchangeInput(e, 'address')}
                                    disabled={!this.state.isDisable}
                                />
                                <label>Số Điện Thoại</label>
                                <input
                                    className="form-control md-4"
                                    type="number"
                                    value={this.state.phonenumber}
                                    onChange={(e) => this.onchangeInput(e, 'phonenumber')}
                                    disabled={!this.state.isDisable}
                                />
                                <button
                                    onClick={() => this.confirmInformation()}
                                    className="btn btn-primary"
                                    style={{ margin: "10px 0", width: 200 }}
                                >
                                    {this.state.isDisable ? 'Xác Nhận Thông Tin' : 'Chỉnh Sửa'}
                                </button>
                            </div>
                            <RadioGroup defaultValue={"shipcod"}
                                onChange={(e) => this.handlePayment(e)}
                            >
                                <FormControlLabel
                                    value="shipcod"
                                    control={<Radio />}
                                    label={"Thanh toán khi nhận hàng"}
                                    disabled={this.state.isDisable}
                                />
                                <FormControlLabel
                                    value="paypal"
                                    control={<Radio />}
                                    label={"Thanh toán qua cổng paypal"}
                                    disabled={this.state.isDisable}
                                />
                            </RadioGroup>
                            {
                                (methodPayment === "paypal" && !this.state.isDisable) ?
                                    <Paypal
                                        amoutValue={calculateTotal}
                                        getDataStore={this.getDataStore}
                                        handleClose={this.handleClose}
                                        completeOrder={this.completeOrder}
                                        saveHistory={this.saveHistory}
                                        createDataFakePaypal={this.createDataFakePaypal}
                                        deleteDataFakePaypal={this.deleteDataFakePaypal}
                                    /> :
                                    <div style={{ height: 150 }}>
                                        <button
                                            className="btn btn-primary"
                                            disabled={this.state.isDisable}
                                            onClick={() => this.paymentCashOnReceipt()}
                                        >
                                            Đặt Hàng
                                        </button>
                                    </div>
                            }
                            <Button
                                className="btn-close-payment"
                                onClick={() => this.handleClose()}
                            >Thoát</Button>
                        </Box>
                    </Modal>
                </LoadingOverlay>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalPayment);
