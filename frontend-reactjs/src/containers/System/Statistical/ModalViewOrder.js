import React, { Component } from "react";
import { connect } from "react-redux";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { getOrderByTransactionCash, getOrderByTransactionPaypal }
    from '../../../services/userService';

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
        console.log(dataOrder)
        return (
            <div className="modal-store-container">
                <Modal
                    open={this.props.isOpenModal}
                    onClose={() => this.handleClose()}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: 900, height: 700 }}>
                        <div>
                            Chi Tiết Đơn Hàng
                        </div>
                        <div className="table-danh-sach-don-hang">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Ảnh</th>
                                        <th>Tên</th>
                                        <th>Số Lượng</th>
                                        <th>Giá</th>
                                        <th>Khuyến Mãi(%)</th>
                                        <th>Số Tiền Đã Thanh Toán</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataOrder && dataOrder.length > 0 &&
                                        dataOrder.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div>
                                                        Ảnh
                                                        {/* {
                                                            this.props.typePayment === "cashonreceipt" ?
                                                                item.cashProduct.image :
                                                                item.productPaypal.image
                                                        } */}
                                                    </div>
                                                </td>
                                                <td>
                                                    {item.cashProduct && item.cashProduct.paintName}
                                                    {item.productPaypal && item.productPaypal.paintName}
                                                </td>
                                                <td>{item.amount}</td>
                                                <td>{item.makePrice}</td>
                                                <td>{item.discount}</td>
                                                <td>{item.paymentAmount}</td>
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
