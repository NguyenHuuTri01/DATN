import React, { Component } from "react";
import { connect } from "react-redux";
import './Shoping.scss';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CurrencyFormat from 'react-currency-format';
import { getAllLoaiSon, getAllPaintProduct } from '../../../services/userService';

class Shoping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            portfolio: [],
            portfolioSearch: '',
            store: [],
            searchName: '',
        }
    }
    async componentDidMount() {
        let copydata = await getAllPaintProduct();
        if (copydata && copydata.errCode === 0) {
            this.setState({
                data: [...copydata.data],
            })
        }


        let copyPortfolio = await getAllLoaiSon();
        if (copyPortfolio && copyPortfolio.errCode === 0) {
            this.setState({
                portfolio: [...copyPortfolio.data],
            })
        }
    }
    handleClickPortfolio = (id) => {
        this.setState({
            portfolioSearch: id
        })
    }
    handleClickAllPortfolio = () => {
        this.setState({
            portfolioSearch: ''
        })
    }
    handleAddToCart = (e, item) => {
        e.stopPropagation()
        this.props.handleAddToCart(item)
    }
    handleSeeDetail = () => {
        console.log("see detail")
    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.setState({
                searchName: event.target.value
            })
        }
    }

    render() {
        let { data, portfolio, portfolioSearch, searchName } = this.state;
        return (
            <div className="shoping-container">
                <div className="content-left">
                    <div
                        className="search-paint"
                    >
                        <input
                            className="form-control"
                            placeholder="Tìm theo tên"
                            onKeyDown={(event) => this.handleKeyDown(event)}
                        />
                    </div>
                    <FormControl>
                        <FormLabel
                            className="title-portfolio"
                        >
                            Các Loại Sơn
                        </FormLabel>
                        <RadioGroup defaultValue={"ALL"}>
                            <div className="radio-btn-portfolio">
                                <FormControlLabel
                                    value="ALL"
                                    control={<Radio />}
                                    label={"Tất cả"}
                                    onClick={() => this.handleClickAllPortfolio()}
                                />
                                {
                                    portfolio && portfolio.length > 0 && portfolio.map((item, index) => (
                                        <FormControlLabel
                                            value={item.paintId}
                                            key={index}
                                            control={<Radio />}
                                            label={item.name}
                                            onClick={() => this.handleClickPortfolio(item.paintId)}
                                        />
                                    ))
                                }
                            </div>
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className="content-right">
                    {
                        data && data.length > 0 &&
                        data.filter((item) => {
                            return searchName.toLowerCase() === '' ?
                                item :
                                item.paintName.toLowerCase().includes(searchName.toLowerCase());
                        })
                            .filter((item) => {
                                return portfolioSearch.toLowerCase() === '' ?
                                    item :
                                    item.paintCatelory.toLowerCase().includes(portfolioSearch.toLowerCase());
                            }
                            )
                            .map((item, index) => (
                                <div
                                    key={index}
                                    className="content-child"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                    onClick={() => this.handleSeeDetail()}
                                >
                                    <div className="name-sale">
                                        <div className="name-item">
                                            {item.paintName}
                                        </div>
                                        <div className={item.paintDiscount === '0' ? "no-sale" : "sale-off-item"} >
                                            {`- ${item.paintDiscount} %`}
                                        </div>
                                        {
                                            item.paintDiscount !== '0' ?
                                                <CurrencyFormat
                                                    value={item.paintPrice}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={' đ'}
                                                    className="price-origin"
                                                />
                                                : ""
                                        }
                                        <CurrencyFormat
                                            value={(item.paintPrice * (100 - item.paintDiscount)) / 100}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={' đ'}
                                            className="price-sale"
                                        />
                                    </div>
                                    <div className="btn-add-to-cart">
                                        <button
                                            className="btn-add"
                                            onClick={(e) => this.handleAddToCart(e, item)}

                                        >Thêm vào giỏ hàng</button>
                                    </div>
                                </div>
                            ))
                    }
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Shoping);
