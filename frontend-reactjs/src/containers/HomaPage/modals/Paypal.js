import React, { Component } from "react";
import { connect } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

class Paypal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paidFor: false,
        }
    }
    paypalOptions = {
        "client-id": 'AfybGPrgJ0RoXorQ2pRv0Iym0Km37YfPnJVbHBTrwU7vgeJjZFEA0a2IwvbwRoHClMfJnPwbtFrjlzoh',
        currency: 'USD',
    };

    async componentDidMount() {
    }
    createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: '0.01',
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
        console.log(order);
    };

    render() {

        return (
            <div>
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
