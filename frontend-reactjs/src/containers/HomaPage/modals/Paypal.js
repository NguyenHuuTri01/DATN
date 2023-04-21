import React, { Component } from "react";
import { connect } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { toast } from "react-toastify";

class Paypal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paidFor: false,
            paymentAmount: 0
        }
    }
    paypalOptions = {
        "client-id": 'AfybGPrgJ0RoXorQ2pRv0Iym0Km37YfPnJVbHBTrwU7vgeJjZFEA0a2IwvbwRoHClMfJnPwbtFrjlzoh',
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
    createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: this.state.paymentAmount,
                    },
                },
            ],
        });
    };
    onApprove = async (data, actions) => {
        const order = await actions.order.capture();
        this.setState({ paidFor: true });

        // Gọi API từ phía backend để xử lý đơn hàng
        // const response = await axios.post('/api/paypal/success', {
        //     orderID: order.id,
        // });
        // console.log('data paypal:', data);

        // await this.props.completeOrder();
        await this.props.saveHistory(order);
        // await this.props.getDataStore();
        // await this.props.handleClose();
        // toast.success("Đặt Hàng Thành Công!")
        // console.log(order);
    };

    render() {
        return (
            <div style={{ width: 100 }}>
                <PayPalScriptProvider
                    options={this.paypalOptions}
                >
                    <PayPalButtons
                        createOrder={this.createOrder} onApprove={this.onApprove}
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
