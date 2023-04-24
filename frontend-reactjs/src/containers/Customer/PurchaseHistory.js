import React, { Component } from "react";
import { connect } from "react-redux";
import './PurchaseHistory.scss';
import { getHistoryPaypal, getHistoryCash, getTransactionById } from '../../services/userService';

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
        // if (prevState.historyPaypal !== this.state.historyPaypal ||
        //     prevState.historyCash !== this.state.historyCash)
        //     this.getListTransaction();
    }
    getListTransaction = () => {
        let transactionPaypal = this.state.historyPaypal.map(history => history.transactionId);
        let uniqueTransactionPaypal = transactionPaypal.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        let transactionCash = this.state.historyCash.map(history => history.transactionId);
        let uniqueTransactionCash = transactionCash.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        this.setState({
            listTransactionId: [...uniqueTransactionPaypal, ...uniqueTransactionCash]
        })
    }
    render() {
        let { historyPaypal, historyCash, listOrder } = this.state;
        console.log(historyPaypal)
        console.log(listOrder)
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
                                                    {paypalItem.makePrice}
                                                </div>
                                                <div className="history-discount history-td">
                                                    {paypalItem.discount}
                                                </div>
                                                <div className="history-payment-date history-td">
                                                    {paypalItem.paymentDate}
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
                                                    {cashItem.makePrice}
                                                </div>
                                                <div className="history-discount history-td">
                                                    {cashItem.discount}
                                                </div>
                                                <div className="history-payment-date history-td">
                                                    {cashItem.updatedAt}
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
                                            <button className="btn btn-primary">
                                                Hủy
                                            </button> :
                                            item.transportStatus
                                    }
                                </div>
                            </div>
                        )
                    })
                }
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
