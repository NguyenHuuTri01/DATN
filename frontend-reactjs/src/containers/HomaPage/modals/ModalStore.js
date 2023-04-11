import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import './ModalStore.scss';
import StoreItem from "./StoreItem";
import _ from "lodash";
import CurrencyFormat from 'react-currency-format';
import ModalPayment from "./ModalPayment";

class ModalStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            calculateTotal: 0,
            listPainBucket: [],
            isUpdateCountItem: true,
        }
    }

    async componentDidMount() {
    }

    handleClose = () => {
        this.setState({
            calculateTotal: 0,
            isUpdateCountItem: true
        })
        this.props.handleCloseModal()
    }

    handleChange = (e) => {
        this.setState({
            checked: e.target.checked
        })
    }

    handleCheckedStore = (e, item) => {
        let coppyState = [...this.state.listPainBucket]
        if (e.target.checked) {
            coppyState.push(item)
            this.setState({
                calculateTotal: this.state.calculateTotal + item.price * item.sl,
                listPainBucket: [...coppyState],
                isUpdateCountItem: false,
            })
        } else {
            let removeIndex = coppyState.findIndex((itemList) => itemList.id === item.id);
            coppyState.splice(removeIndex, 1)
            this.setState({
                calculateTotal: this.state.calculateTotal - item.price * item.sl,
                listPainBucket: [...coppyState],
                isUpdateCountItem: true,
            })
        }
    }

    handlePayPainBucket = () => {
        this.props.handlePayPainBucket(this.state.listPainBucket, this.state.calculateTotal);
        this.props.handleCloseModal();
        this.setState({
            listPainBucket: [],
            isUpdateCountItem: true
        })
    }

    onChangeQuantity = (e, item) => {
        let newValue = +e.target.value;
        if (newValue > item.quantity) {
            item.sl = item.quantity
            this.setState()
        } else
            if (newValue < 1) {
                item.sl = 1
                this.setState()
            } else {
                item.sl = newValue
                this.setState()
            }
    }
    onCLickOpenChildModal = () => {
        this.setState({
            isOpenModalChild: true
        })
    }
    onCLickCloseChildModal = () => {
        this.setState({
            isOpenModalChild: false
        })
    }

    handleSetCheckOut = () => {
        this.setState({
            setCheckOut: true
        })
    }
    render() {
        let { listPainBucket, calculateTotal } = this.state;
        console.log(listPainBucket)
        let { store } = this.props;
        return (
            <div className="modal-store-container">
                <Modal
                    isOpen={this.props.isOpenModal}
                    toggle={() => this.handleClose()}
                    size="lg"
                >
                    <ModalHeader>
                        Giỏ hàng
                    </ModalHeader>
                    <ModalBody>
                        <div className="body-modal-store">
                            {
                                store && store.length > 0 && store.map((item, index) => (
                                    <StoreItem
                                        key={index}
                                        data={item}
                                        handleCheckedStore={this.handleCheckedStore}
                                    />
                                ))
                            }
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <label>Tổng tiền: </label>
                        <CurrencyFormat
                            value={calculateTotal}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={' đ'}
                            className="price-sale"
                        />
                        <Button
                            color="primary"
                            className="px-3"
                            onClick={() => this.handlePayPainBucket()}
                            disabled={
                                _.isEmpty(listPainBucket) || calculateTotal === 0 ?
                                    true : false
                            }
                        >
                            Thanh Toán
                        </Button>
                        <Button
                            color="secondary"
                            className="px-3"
                            onClick={() => this.handleClose()}
                        >
                            Thoát
                        </Button>
                        <ModalPayment
                            listPainBucket={listPainBucket}
                            calculateTotal={calculateTotal}
                        />
                    </ModalFooter>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalStore);
