import React, { Component } from "react";
import { connect } from "react-redux";
import './Shoping.scss';
import data, { listColor } from "./data";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CurrencyFormat from 'react-currency-format';
import { getAllLoaiSon } from '../../../services/userService';

class Shoping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            portfolio: [],
            portfolioSearch: '',
            store: [],
            listColor: [],
            searchColor: '',
            searchName: '',
        }
    }
    async componentDidMount() {
        let copydata = await data;
        let copyPortfolio = await getAllLoaiSon();
        if (copyPortfolio && copyPortfolio.errCode === 0) {
            this.setState({
                data: [...copydata],
                portfolio: [...copyPortfolio.data],
            })
        }
        let listcolor = await listColor;
        this.setState({
            listColor: [...listcolor]
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
    onChangeColor = (e) => {
        console.log(e.target.value)
        this.setState({
            searchColor: e.target.value
        })
    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.setState({
                searchName: event.target.value
            })
        }
    }

    render() {
        let { data, portfolio, portfolioSearch, listColor, searchColor, searchName } = this.state;
        return (
            <div className="shoping-container">
                <div className="content-left">
                    <div
                        className="search-paint"
                    >
                        <input
                            placeholder="Tìm theo tên"
                            onKeyDown={(event) => this.handleKeyDown(event)}
                        />
                        <select
                            style={{
                                backgroundColor: `${searchColor}`,
                            }}
                            className="select-color"
                            onChange={(e) => this.onChangeColor(e)}
                            placeholder="Chọn màu"
                        >
                            <option
                                value={"#fff"}
                            >
                                Tất cả
                            </option>
                            {
                                listColor && listColor.length > 0 &&
                                listColor.map((item, index) => (
                                    <option
                                        style={{ backgroundColor: `${item}` }}
                                        value={item}
                                        key={item}
                                    >
                                    </option>
                                ))
                            }
                        </select>
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
                                item.name.toLowerCase().includes(searchName.toLowerCase());
                        })
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
