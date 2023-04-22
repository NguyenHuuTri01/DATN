import React, { Component } from "react";
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Paypal from "./Paypal";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { updateStatusCart, createTransaction } from '../../../services/userService';
import './ModalPayment.scss';
import _ from "lodash";

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
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }
    handleOpen = () => {
        this.setState({
            isOpen: true
        })
    }
    handleClose = () => {
        this.setState({
            isOpen: false,
            methodPayment: "shipcod"
        })
        this.props.handleClose();
    }
    handlePayment = (e) => {
        this.setState({
            methodPayment: e.target.value
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
    saveHistory = async (dataPaypal) => {
        let { listPainBucket, calculateTotal } = this.props;
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
            let resdata = await createTransaction(listPainBucket)
            console.log(resdata)
        }
    }

    render() {
        let { isOpen, methodPayment } = this.state;
        let { listPainBucket, calculateTotal } = this.props;
        return (
            <>
                <Button
                    className="btn-payment"
                    onClick={() => this.handleOpen()}
                    disabled={
                        _.isEmpty(listPainBucket) || calculateTotal === 0 ?
                            true : false
                    }
                >Thanh Toán</Button>
                <Modal
                    open={isOpen}
                    onClose={() => this.handleClose()}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: 900, height: 500 }}>
                        <RadioGroup defaultValue={"shipcod"}
                            onChange={(e) => this.handlePayment(e)}
                        >
                            <FormControlLabel
                                value="shipcod"
                                control={<Radio />}
                                label={"Thanh toán khi nhận hàng"}
                            />
                            <FormControlLabel
                                value="paypal"
                                control={<Radio />}
                                label={"Thanh toán qua cổng paypal"}
                            />
                        </RadioGroup>
                        {
                            methodPayment === "paypal" ?
                                <Paypal
                                    amoutValue={calculateTotal}
                                    getDataStore={this.getDataStore}
                                    handleClose={this.handleClose}
                                    completeOrder={this.completeOrder}
                                    saveHistory={this.saveHistory}
                                /> : ""
                        }
                        <Button onClick={() => this.handleClose()}>Thoát</Button>
                    </Box>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalPayment);
