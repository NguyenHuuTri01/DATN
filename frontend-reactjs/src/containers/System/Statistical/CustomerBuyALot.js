import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from 'react-paginate';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import './CustomerBuyALot.scss';
import { sumNumberItemBought } from '../../../services/userService';

class CustomerBuyALot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allUser: [], // Dữ liệu bảng
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
            sortUp: true
        };
    }
    async componentDidMount() {
        let res = await sumNumberItemBought();
        if (res && res.errCode === 0) {

            this.setState({
                allUser: res.result.sort((a, b) => a.total_amount - b.total_amount)
            })
        }
    }

    sortUp = () => {
        let coppyState = [...this.state.allUser]
        coppyState.sort((a, b) => a.total_amount - b.total_amount);
        this.setState({
            sortUp: true,
            allUser: [...coppyState]
        })
    }
    sortDown = () => {
        let coppyState = [...this.state.allUser]
        coppyState.sort((a, b) => b.total_amount - a.total_amount);
        this.setState({
            sortUp: false,
            allUser: [...coppyState]
        })
    }

    handlePageClick = ({ selected }) => {
        this.setState({
            currentPage: selected
        });
    };
    render() {
        let { currentPage, perPage, allUser, sortUp } = this.state;
        let offset = currentPage * perPage;
        let pageCount = Math.ceil(allUser.length / perPage);
        let currentPageData = allUser.slice(offset, offset + perPage);

        return (
            <div className="customer-buy-alot-container">
                <div className="customer-buy-alot-title">
                    Thống Kê Lượt Mua Hàng Của Các Tài Khoản
                </div>
                <div className="table-danhmuchang">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '50%' }}>Tên Tài Khoản</th>
                                <th style={{ width: '50%' }}>
                                    Số Lượng Đã Mua (Thùng)
                                    {
                                        sortUp ?
                                            <span onClick={() => this.sortDown()}>
                                                <ArrowUpwardIcon className="sort" />
                                            </span> :
                                            <span onClick={() => this.sortUp()}>
                                                <ArrowDownwardIcon className="sort" />
                                            </span>
                                    }
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        {
                                            item.userCash && item.userCash.email
                                        }
                                        {
                                            item.userPaypal && item.userPaypal.email
                                        }
                                    </td>
                                    <td>{item.total_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerBuyALot);
