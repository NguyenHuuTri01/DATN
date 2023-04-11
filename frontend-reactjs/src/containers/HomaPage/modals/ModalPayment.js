import React, { Component } from "react";
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Paypal from "./Paypal";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

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
    }
    handlePayment = (e) => {
        this.setState({
            methodPayment: e.target.value
        })
    }

    render() {
        let { isOpen, methodPayment } = this.state;
        let { listPainBucket, calculateTotal } = this.props;

        return (
            <>
                <Button onClick={() => this.handleOpen()}>Thanh Toán</Button>
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
                                <Paypal amoutValue={calculateTotal} /> : ""
                        }
                        <Button onClick={() => this.handleClose()}>Close Child Modal</Button>
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
