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
            calculateTotal: 0,
            listPainBucket: [],
            isUpdateCountItem: true,
            store: [],
        }
    }

    async componentDidMount() {
        if (this.props.store) {
            this.setState({
                store: [...this.props.store]
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.store !== this.props.store) {
            this.setState({
                store: [...this.props.store]
            })
        }
    }

    handleClose = () => {
        this.setState({
            calculateTotal: 0,
            isUpdateCountItem: true,
            listPainBucket: []
        })
        this.props.handleCloseModal()
    }

    handleChange = (e) => {
        this.setState({
            checked: e.target.checked
        })
    }

    handleCheckedStore = async (e, item) => {
        let getDataStore = await this.props.getDataStore();
        let getItem = getDataStore.filter((getItem) => {
            return getItem.paintId.includes(item.paintId);
        })
        item.productData.paintDiscount = getItem[0].productData && getItem[0].productData.paintDiscount
        let coppyState = [...this.state.listPainBucket]
        if (e.target.checked) {
            coppyState.push(item)
            this.setState({
                calculateTotal: this.state.calculateTotal + (item.productData.paintPrice * (100 - item.productData.paintDiscount) / 100) * item.amount,
                listPainBucket: [...coppyState],
                isUpdateCountItem: false,
            })
        } else {
            let removeIndex = coppyState.findIndex((itemList) => itemList.productData.id === item.productData.id);
            coppyState.splice(removeIndex, 1)
            this.setState({
                calculateTotal: this.state.calculateTotal - (item.productData.paintPrice * (100 - item.productData.paintDiscount) / 100) * item.amount,
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
            isUpdateCountItem: true,
            calculateTotal: 0
        })
    }

    onChangeQuantity = (e, item) => {
        let newValue = +e.target.value;
        if (newValue > item.paintQuantity) {
            item.sl = item.paintQuantity
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
    getDataStore = () => {
        this.props.getDataStore();
    }
    render() {
        let { listPainBucket, calculateTotal, store } = this.state;
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
                            className="paintPrice-sale"
                        />
                        <Button
                            color="primary"
                            className="px-3"
                            onClick={() => this.handlePayPainBucket()}
                            disabled={
                                _.isEmpty(listPainBucket) ?
                                    true : false
                            }
                        >
                            Xóa khỏi giỏ hàng
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
                            getDataStore={this.getDataStore}
                            handleClose={this.handleClose}
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalStore);
