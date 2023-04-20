import React, { Component } from "react";
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CurrencyFormat from 'react-currency-format';
import './StoreItem.scss';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
class StoreItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countItem: 0,
            checked: false,
            dataChild: {},
            isOpenChildModal: false,
            isUpdateCountItem: true,
        }
    }
    async componentDidMount() {

        let count = await this.props.data.amount;
        this.setState({
            dataChild: { ...this.props.data },
            countItem: count
        })
        console.log(count)
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.countItem !== this.state.countItem) {
            let copyData = { ...this.state.dataChild }
            copyData.amount = this.state.countItem
            this.setState({
                dataChild: { ...copyData }
            })
        }
    }

    handleChecked = (e, dataChild) => {
        this.props.handleCheckedStore(e, dataChild);
        this.setState({
            isUpdateCountItem: !this.state.isUpdateCountItem
        })
    }

    handleOnChangeCount = (e) => {
        console.log(e.target.value)
        this.setState({
            countItem: e.target.value,
        })
    }

    handleOpen = () => {
        this.setState({
            isOpenChildModal: true
        })
    }

    handleClose = () => {
        let { countItem } = this.state;
        let { data } = this.props;
        if (countItem === '' || + countItem <= 0) {
            this.setState({
                countItem: 1
            })
        }
        if (countItem > (+data.paintQuantity)) {
            this.setState({
                countItem: data.paintQuantity
            })
        }
        this.setState({
            isOpenChildModal: false
        })
    }

    updateCountItem = () => {
        this.handleClose();
    }

    render() {
        let { countItem, dataChild, isOpenChildModal, isUpdateCountItem } = this.state;
        let { data } = this.props;
        return (
            <>
                <div
                    className={
                        isUpdateCountItem ?
                            "store-item" :
                            "store-item store-item-checked"
                    }>
                    <input
                        className="checkbox-item"
                        type="checkbox"
                        id={data.productData.id}
                        name={data.productData.paintName}
                        value={data.productData.paintPrice}
                        onChange={(e) => this.handleChecked(e, dataChild)}
                    />
                    <div
                        className="image-item"
                        style={{ backgroundImage: `url(${data.productData.image})` }}
                    ></div>
                    <div className="infor-item">
                        <div className="name-product">{`${data.productData.paintName}`}</div>
                        <div>Số lượng hàng trong kho:
                            <span style={{ marginLeft: 5, color: "red" }}>
                                {data.productData.paintQuantity}
                            </span>
                        </div>
                        <div>
                            Giá tiền: {
                                <CurrencyFormat
                                    value={(data.productData.paintPrice * (100 - data.productData.paintDiscount)) / 100}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' đ'}
                                    className="price-sale"
                                    style={{ color: "red" }}
                                />
                            }</div>
                        <div>Số lượng:
                            <label
                                style={{ marginLeft: "5px", color: "blue", fontSize: "15px" }}
                            >{countItem}</label>
                        </div>
                        <div>
                            {
                                isUpdateCountItem ?
                                    <Button
                                        className="btn-update-count-item"
                                        onClick={() => this.handleOpen()}
                                    >Cập Nhật Số Lượng</Button>
                                    : ""
                            }
                            <Modal
                                open={isOpenChildModal}
                                onClose={() => this.handleClose()}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography
                                        id="modal-modal-title"
                                        variant="h6"
                                        component="h2"
                                    >
                                        Nhập số lượng
                                    </Typography>
                                    <input
                                        type="number"
                                        style={{ width: "80%", outline: "none" }}
                                        value={countItem}
                                        onChange={(e) => this.handleOnChangeCount(e)}
                                    />
                                    <Button
                                        onClick={() => this.updateCountItem()}
                                    >Ok</Button>
                                </Box>
                            </Modal>
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(StoreItem);
