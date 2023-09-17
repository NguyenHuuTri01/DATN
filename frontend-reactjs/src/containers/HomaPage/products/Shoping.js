import React, { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import './Shoping.scss';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { getAllLoaiSon, getAllPaintProduct } from '../../../services/userService';
import { withRouter } from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';

let ItemProduct = lazy(() => import('./ItemProduct'));

class Shoping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            portfolio: [],
            portfolioSearch: '',
            store: [],
            searchName: '',
            searchDiscount: false,
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
        this.handleClickAscPrice();
    }
    handleClickPortfolio = (id) => {
        this.setState({
            portfolioSearch: id,
            searchDiscount: false
        })
    }
    handleClickAllPortfolio = () => {
        this.setState({
            portfolioSearch: '',
            searchDiscount: false
        })
    }
    handleAddToCart = (e, item) => {
        if (this.props.isLoggedIn) {
            e.stopPropagation()
            this.props.handleAddToCart(item)
        } else {
            e.stopPropagation()
            alert("Đăng nhập để mua hàng!")
        }
    }
    handleSeeDetail = (itemData) => {
        if (this.props.history) {
            this.props.history.push(`/detail/${itemData}`);
        }
    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.setState({
                searchName: event.target.value
            })
        }
    }
    handleClickSearchDiscount = () => {
        this.setState({
            portfolioSearch: '',
            searchDiscount: true
        })
    }
    // giá tăng dần
    handleClickAscPrice = () => {
        let coppyState = [...this.state.data]
        coppyState.sort((a, b) => a.paintPrice * (100 - a.paintDiscount) / 100 - b.paintPrice * (100 - b.paintDiscount) / 100);
        this.setState({
            data: [...coppyState]
        })
    }
    // giá giảm dần
    handleClickDescPrice = () => {
        let coppyState = [...this.state.data]
        coppyState.sort((a, b) => b.paintPrice * (100 - b.paintDiscount) / 100 - a.paintPrice * (100 - a.paintDiscount) / 100);
        this.setState({
            data: [...coppyState]
        })
    }
    render() {
        let { data, portfolio, portfolioSearch, searchName, searchDiscount } = this.state;
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
                        <RadioGroup defaultValue={"ASC"}>
                            <div>
                                <FormControlLabel
                                    value="ASC"
                                    control={<Radio />}
                                    label={"Giá tăng dần"}
                                    onClick={() => this.handleClickAscPrice()}
                                />
                                <FormControlLabel
                                    value="DESC"
                                    control={<Radio />}
                                    label={"Giá giảm dần"}
                                    onClick={() => this.handleClickDescPrice()}
                                />
                            </div>
                        </RadioGroup>
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
                                <FormControlLabel
                                    value=""
                                    control={<Radio />}
                                    label={"Đang khuyến mãi"}
                                    onClick={() => this.handleClickSearchDiscount()}
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
                            ).filter((item) => {
                                return searchDiscount === false ?
                                    item :
                                    item.paintDiscount > 0
                            }
                            )
                            .map((item, index) => (
                                <Suspense key={index} fallback={<CircularProgress />}>
                                    <ItemProduct
                                        item={item}
                                        handleAddToCart={this.handleAddToCart}
                                        handleSeeDetail={this.handleSeeDetail}
                                    />
                                </Suspense>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Shoping));
