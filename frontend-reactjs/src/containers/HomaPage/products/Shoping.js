import React, { Component } from "react";
import { connect } from "react-redux";
import './Shoping.scss';
import data, { portfolio } from "./data";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CurrencyFormat from 'react-currency-format';

class Shoping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            portfolio: [],
            portfolioSearch: '',
            store: [],
        }
    }
    async componentDidMount() {
        let copydata = await data;
        let copyPortfolio = await portfolio;
        this.setState({
            data: [...copydata],
            portfolio: [...copyPortfolio],
        })
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
    render() {
        let { data, portfolio, portfolioSearch } = this.state;
        return (
            <div className="shoping-container">
                <div className="content-left">
                    <FormControl>
                        <FormLabel
                            className="title-portfolio"
                        >Các Loại Sơn</FormLabel>
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
                                            value={item.id}
                                            key={index}
                                            control={<Radio />}
                                            label={item.name}
                                            onClick={() => this.handleClickPortfolio(item.id)}
                                        />
                                    ))
                                }
                            </div>
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className="content-right">
                    {
                        data && data.length > 0 && data
                            .filter((item) => {
                                return portfolioSearch.toLowerCase() === '' ?
                                    item :
                                    item.portfolio.toLowerCase().includes(portfolioSearch.toLowerCase());
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
                                            {item.name}
                                        </div>
                                        <div className={item.sale === '0' ? "no-sale" : "sale-off-item"} >
                                            {`- ${item.sale} %`}
                                        </div>
                                        {
                                            item.sale !== '0' ?
                                                <CurrencyFormat
                                                    value={item.price}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={' đ'}
                                                    className="price-origin"
                                                />
                                                : ""
                                        }
                                        <CurrencyFormat
                                            value={(item.price * (100 - item.sale)) / 100}
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
