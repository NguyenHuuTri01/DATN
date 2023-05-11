import React, { Component } from "react";
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { getOrderByTransactionCash, getOrderByTransactionPaypal }
    from '../../../services/userService';
import './ModalViewOrder.scss';
import CurrencyFormat from 'react-currency-format';

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

class ModalViewOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataOrder: []
        }
    }

    async componentDidMount() {
        if (this.props.data && this.props.data.typePayment === "cashonreceipt") {
            this.getDataTransactionCash();
        } else if (this.props.data && this.props.data.typePayment === "paypal") {
            this.getDataTransactionPaypal();
        }
    }
    getDataTransactionCash = async () => {
        let dataorder = await getOrderByTransactionCash({
            transactionId: this.props.data.transactionId
        })
        if (dataorder && dataorder.errCode === 0) {
            this.setState({
                dataOrder: dataorder.data
            })
        }
    }
    getDataTransactionPaypal = async () => {
        let dataorder = await getOrderByTransactionPaypal({
            transactionId: this.props.data.transactionId
        })
        if (dataorder && dataorder.errCode === 0) {
            this.setState({
                dataOrder: dataorder.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data !== this.props.data) {
            if (this.props.data && this.props.data.typePayment === "cashonreceipt") {
                this.getDataTransactionCash();
            } else if (this.props.data && this.props.data.typePayment === "paypal") {
                this.getDataTransactionPaypal();
            }
        }
    }


    handleClose = () => {
        this.props.handleCloseView();
    }

    render() {
        let { dataOrder } = this.state;
        return (
            <div className="modal-danh-sach-don-hang">
                <Modal
                    open={this.props.isOpenModal}
                    onClose={() => this.handleClose()}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: 1200, height: 700 }}>
                        <div className="title-chi-tiet-don-hang">
                            Chi Tiết Đơn Hàng
                        </div>
                        <div className="chi-tiet-don-hang">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Ảnh</th>
                                        <th>Tên</th>
                                        <th>Số Lượng</th>
                                        <th>Giá</th>
                                        <th>Khuyến Mãi(%)</th>
                                        <th>Số Tiền Cần Thanh Toán</th>
                                        <th>Số Tiền Đã Thanh Toán</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataOrder && dataOrder.length > 0 &&
                                        dataOrder.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div
                                                        className="image-order"
                                                        style={{
                                                            backgroundImage: `url(
                                                            ${(item.cashProduct && item.cashProduct.image) || (item.productPaypal && item.productPaypal.image)}
                                                            )`
                                                        }}>
                                                    </div>
                                                </td>
                                                <td>
                                                    {item.cashProduct && item.cashProduct.paintName}
                                                    {item.productPaypal && item.productPaypal.paintName}
                                                </td>
                                                <td>{item.amount}</td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={item.makePrice}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={' đ'}
                                                        className="price-origin"
                                                    />
                                                </td>
                                                <td>{item.discount}</td>
                                                <td>
                                                    <CurrencyFormat
                                                        value={(item.amount * item.makePrice) * (100 - item.discount) / 100}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={' đ'}
                                                        className="price-origin"
                                                    />
                                                </td>
                                                <td>{item.paymentAmount ? `${item.paymentAmount} $` :
                                                    "Thanh Toán Khi Nhận Hàng"}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </Box>
                </Modal>

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

export default connect(mapStateToProps, mapDispatchToProps)(ModalViewOrder);
