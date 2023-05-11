import React, { Component } from "react";
import { connect } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from "react-toastify";

class Paypal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paidFor: false,
            paymentAmount: 0,
        }
    }
    paypalOptions = {
        "client-id": process.env.REACT_APP_CLIENT_ID,
        currency: 'USD',
    };

    async componentDidMount() {
        if (this.props.amoutValue > 0) {
            let valueUSD = parseFloat((this.props.amoutValue / 23000).toFixed(2));
            this.setState({
                paymentAmount: valueUSD
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.amoutValue !== this.props.amoutValue) {
            let valueUSD = parseFloat((this.props.amoutValue / 23000).toFixed(2))
            this.setState({
                paymentAmount: valueUSD
            })
        }
    }
    createOrder = async (data, actions) => {
        let res = await this.props.createDataFakePaypal();
        if (res && res.errCode === 0) {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: this.state.paymentAmount,
                        },
                    },
                ],
            });
        }
    };
    onApprove = async (data, actions) => {
        const order = await actions.order.capture();
        this.setState({ paidFor: true });
        await this.props.completeOrder();
        await this.props.saveHistory(order);
        await this.props.getDataStore();
        await this.props.handleClose();
        toast.success("Đặt Hàng Thành Công!")
    };

    render() {
        return (
            <div style={{ width: 250, height: 150 }}>
                <PayPalScriptProvider
                    options={this.paypalOptions}
                >
                    <PayPalButtons
                        createOrder={this.createOrder}
                        onApprove={this.onApprove}
                        onError={(error) => {
                            console.log(error)
                            this.props.deleteDataFakePaypal();
                            toast.error("Đặt hàng thất bại!")
                            this.props.getDataStore();
                            this.props.handleClose();
                        }}
                    />
                </PayPalScriptProvider>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Paypal);
