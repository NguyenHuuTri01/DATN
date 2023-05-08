import React, { Component } from "react";
import CurrencyFormat from 'react-currency-format';

class ItemProduct extends Component {

    render() {
        let { item } = this.props;
        return (
            <div
                className="content-child"
                style={{ backgroundImage: `url(${item.image})` }}
                onClick={() => this.props.handleSeeDetail(item.paintId)}
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
                        onClick={(e) => this.props.handleAddToCart(e, item)}
                    >Thêm vào giỏ hàng</button>
                </div>
            </div>
        );
    }
}

export default ItemProduct;
