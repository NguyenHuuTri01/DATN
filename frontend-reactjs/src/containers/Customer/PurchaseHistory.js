import React, { Component } from "react";
import { connect } from "react-redux";
import './PurchaseHistory.scss';
import {
    getHistoryPaypal, getHistoryCash, getTransactionById,
    cancelOrderPaypal, cancelOrderCash
}
    from '../../services/userService';
import CurrencyFormat from 'react-currency-format';
import moment from 'moment';

class PurchaseHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            historyPaypal: [],
            historyCash: [],
            listTransactionId: [],
            listOrder: [],
        }
    }
    async componentDidMount() {
        if (this.props.userInfo && this.props.userInfo.id) {
            let listHistoryPaypal = await getHistoryPaypal(this.props.userInfo.id);
            let listHistoryCash = await getHistoryCash(this.props.userInfo.id);
            let listOrder = await getTransactionById(this.props.userInfo.id);
            this.setState({
                historyPaypal: listHistoryPaypal.data,
                historyCash: listHistoryCash.data,
                listOrder: listOrder.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            let listHistoryPaypal = await getHistoryPaypal(this.props.userInfo.id);
            let listHistoryCash = await getHistoryCash(this.props.userInfo.id);
            let listOrder = await getTransactionById(this.props.userInfo.id);
            this.setState({
                historyPaypal: listHistoryPaypal.data,
                historyCash: listHistoryCash.data,
                listOrder: listOrder.data
            })
        }
    }
    handleCancelOrder = async (typePayment, transactionId) => {
        if (window.confirm('Bạn muốn hủy đơn hàng này?')) {
            if (typePayment === 'cashonreceipt') {
                let res = await cancelOrderCash({
                    transactionId: transactionId
                });
                if (res && res.errCode === 0) {
                    let listHistoryPaypal = await getHistoryPaypal(this.props.userInfo.id);
                    let listHistoryCash = await getHistoryCash(this.props.userInfo.id);
                    let listOrder = await getTransactionById(this.props.userInfo.id);
                    this.setState({
                        historyPaypal: listHistoryPaypal.data,
                        historyCash: listHistoryCash.data,
                        listOrder: listOrder.data
                    })
                }
            } else if (typePayment === "paypal") {
                let res = await cancelOrderPaypal({
                    transactionId: transactionId
                })
                if (res && res.errCode === 0) {
                    let listHistoryPaypal = await getHistoryPaypal(this.props.userInfo.id);
                    let listHistoryCash = await getHistoryCash(this.props.userInfo.id);
                    let listOrder = await getTransactionById(this.props.userInfo.id);
                    this.setState({
                        historyPaypal: listHistoryPaypal.data,
                        historyCash: listHistoryCash.data,
                        listOrder: listOrder.data
                    })
                }
            }
        } else {
            // xử lý khi chọn No
        }

    }

    render() {
        let { historyPaypal, historyCash, listOrder } = this.state;
        return (
            <div className="history-container">
                <div className="history-title">
                    Lịch Sử Mua Hàng
                </div>
                <div className="history-table-title">
                    <div className="title-id title-text">Mã Đơn Hàng</div>
                    <div className="title-image title-text">Ảnh</div>
                    <div className="title-name title-text">Tên</div>
                    <div className="title-amount title-text">SL</div>
                    <div className="title-price title-text">Giá tiền(VND)</div>
                    <div className="title-discount title-text">KM(%)</div>
                    <div className="title-color title-text">Màu</div>
                    <div className="title-date title-text">Ngày Đặt</div>
                    <div className="title-payment title-text">Loại Thanh Toán</div>
                    <div className="title-transport title-text">Vận Chuyển</div>
                </div>
                {
                    listOrder && listOrder.length > 0 &&
                    listOrder.map((item, index) => {
                        return (
                            <div key={index} className="history-list">
                                <div className="transaction-id">{item.transactionId}</div>
                                <div className="filter-transaction">
                                    {historyPaypal && historyPaypal.length > 0
                                        && historyPaypal.filter((paypal) => {
                                            return paypal.transactionId.includes(item.transactionId)
                                        }).map((paypalItem, paypalIndex) => (
                                            <div key={paypalIndex} style={{ display: 'flex' }}>
                                                <div
                                                    className="history-paint-image"
                                                    style={{
                                                        backgroundImage: `url(${paypalItem.productPaypal.image})`
                                                    }}
                                                >
                                                </div>
                                                <div className="history-paint-name history-td">
                                                    {paypalItem.productPaypal.paintName}
                                                </div>
                                                <div className="history-amount history-td">
                                                    {paypalItem.amount}
                                                </div>
                                                <div className="history-price history-td">
                                                    <CurrencyFormat
                                                        value={paypalItem.makePrice}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={' đ'}
                                                        className="price-origin"
                                                    />
                                                </div>
                                                <div className="history-discount history-td">
                                                    {paypalItem.discount}
                                                </div>
                                                <div className="history-color history-td">
                                                    {paypalItem.color}
                                                </div>
                                                <div className="history-payment-date history-td">
                                                    {moment.unix(paypalItem.paymentDate).format('DD/MM/YYYY')}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="filter-transaction">
                                    {historyCash && historyCash.length > 0
                                        && historyCash.filter((cash) => {
                                            return cash.transactionId.includes(item.transactionId)
                                        }).map((cashItem, cashIndex) => (
                                            <div key={cashIndex} style={{ display: 'flex' }}>
                                                <div
                                                    className="history-paint-image"
                                                    style={{
                                                        backgroundImage: `url(${cashItem.cashProduct.image})`
                                                    }}
                                                >
                                                </div>
                                                <div className="history-paint-name history-td">
                                                    {cashItem.cashProduct.paintName}
                                                </div>
                                                <div className="history-amount history-td">
                                                    {cashItem.amount}
                                                </div>
                                                <div className="history-price history-td">
                                                    <CurrencyFormat
                                                        value={cashItem.makePrice}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={' đ'}
                                                        className="price-origin"
                                                    />
                                                </div>
                                                <div className="history-discount history-td">
                                                    {cashItem.discount}
                                                </div>
                                                <div className="history-color history-td">
                                                    {cashItem.color}
                                                </div>
                                                <div className="history-payment-date history-td">
                                                    {moment(cashItem.updatedAt).format('DD/MM/YYYY')}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="type-payment">
                                    {
                                        item.typePayment === 'cashonreceipt' ?
                                            'Thanh toán khi nhận hàng' :
                                            item.typePayment
                                    }
                                </div>
                                <div className="transport">
                                    {
                                        item.transportStatus === 'chua' ?
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => this.handleCancelOrder(item.typePayment, item.transactionId)}
                                            >
                                                Hủy
                                            </button> :
                                            (item.transportStatus === 'cancel' ? 'Đã Hủy' :
                                                (item.transportStatus === 'dang van chuyen' ?
                                                    'Đang Vận Chuyển' : 'Đã Nhận Hàng')
                                            )
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                <div style={{ height: 20 }}></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseHistory);
