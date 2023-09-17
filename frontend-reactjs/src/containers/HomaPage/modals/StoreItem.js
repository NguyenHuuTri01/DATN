import React, { Component } from "react";
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CurrencyFormat from 'react-currency-format';
import { updateCart } from '../../../services/userService';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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
            color: 'Trắng'
        }
    }
    async componentDidMount() {

        let count = await this.props.data.amount;
        this.setState({
            dataChild: { ...this.props.data },
            countItem: count,
        })
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
        dataChild.color = this.state.color;
        this.props.handleCheckedStore(e, dataChild);
        this.setState({
            isUpdateCountItem: !this.state.isUpdateCountItem
        })
    }

    handleOnChangeCount = (e) => {
        this.setState({
            countItem: Math.floor(e.target.value),
        })
    }

    handleOpen = () => {
        this.setState({
            isOpenChildModal: true
        })
    }

    handleClose = async () => {
        let { countItem } = this.state;
        let { data } = this.props;

        if (countItem === '' || + countItem <= 0) {
            await updateCart({
                userId: data.userId,
                paintId: data.paintId,
                amount: 1
            });
            this.setState({
                countItem: 1
            })
        } else
            if (countItem > (+data.productData.paintQuantity)) {
                await updateCart({
                    userId: data.userId,
                    paintId: data.paintId,
                    amount: data.productData.paintQuantity
                });
                this.setState({
                    countItem: data.productData.paintQuantity
                })
            } else {
                await updateCart({
                    userId: data.userId,
                    paintId: data.paintId,
                    amount: countItem
                });
            }
        this.setState({
            isOpenChildModal: false
        })
    }

    updateCountItem = () => {
        this.handleClose();
    }
    handleChangeSelect = (event) => {
        this.setState({
            color: event.target.value
        })
    }

    render() {
        let { countItem, dataChild, isOpenChildModal, isUpdateCountItem, color } = this.state;
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
                        id={data ? data.paintId : ''}
                        name={data && data.productData && data.productData.paintName}
                        value={data && data.productData && data.productData.paintPrice}
                        onChange={(e) => this.handleChecked(e, dataChild)}
                    />
                    <div
                        className="image-item"
                        style={{
                            backgroundImage: `url(${data && data.productData && data.productData.image})`
                        }}
                    ></div>
                    <div className="infor-item">
                        <div className="name-product">
                            {`${data && data.productData &&
                                data.productData.paintName}`}
                        </div>
                        <div>Số lượng hàng trong kho:
                            <span style={{ marginLeft: 5, color: "red" }}>
                                {data && data.productData && data.productData.paintQuantity}
                            </span>
                        </div>
                        <div>
                            Giá tiền: {
                                <CurrencyFormat
                                    value={(
                                        (data && data.productData && data.productData.paintPrice) *
                                        (100 - (data && data.productData && data.productData.paintDiscount))) / 100}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' đ'}
                                    className="price-sale"
                                    style={{ color: "red" }}
                                />
                            }</div>
                        <div className="number-paint">Số lượng:
                            <label
                                style={{ marginLeft: "5px", color: "blue", fontSize: "15px" }}
                            >{+countItem}</label>
                            <label className="notification">
                                {`(Bạn được mua tối đa ${data && data.productData && data.productData.paintQuantity})`}
                            </label>
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
                            {isUpdateCountItem ?
                                <div className="select-color">
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        className="select-content"
                                        value={color}
                                        onChange={(e) => this.handleChangeSelect(e)}
                                    >
                                        <MenuItem
                                            style={{ backgroundColor: "#fff" }}
                                            value={"Trắng"}
                                        >Trắng</MenuItem>
                                        <MenuItem
                                            style={{ backgroundColor: "#C0C0C0" }}
                                            value={"Xám"}
                                        >Xám</MenuItem>
                                        <MenuItem
                                            value={"Nâu"}
                                            style={{ backgroundColor: "#964B00" }}
                                        >Nâu</MenuItem>
                                        <MenuItem
                                            style={{ backgroundColor: "#228B22" }}
                                            value={"Xanh Lá Cây"}
                                        >Xanh Lá Cây</MenuItem>
                                        <MenuItem
                                            style={{ backgroundColor: "#FF69B4" }}
                                            value={"Hồng"}
                                        >Hồng</MenuItem>
                                        <MenuItem
                                            style={{ backgroundColor: "#FFA500" }}
                                            value={"Vàng"}
                                        >Vàng</MenuItem>
                                    </Select>
                                </div>
                                : ""}
                        </div>
                    </div>
                </div>
            </>

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

export default connect(mapStateToProps, mapDispatchToProps)(StoreItem);
