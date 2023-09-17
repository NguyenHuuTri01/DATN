import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllCancelOrder } from '../../../services/userService';
import ReactPaginate from 'react-paginate';
import './ListOrder.scss';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import ModalViewOrder from "./ModalViewOrder";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

class ListCancelOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOrder: [],
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
            isOpenView: false,
            dataTransaction: [],
            searchTransaction: '',
            searchEmail: '',
            searchPTTT: '',
        };
    }
    async componentDidMount() {
        let datalist = await getAllCancelOrder();
        if (datalist && datalist.errCode === 0) {
            this.setState({
                listOrder: datalist.data
            })
        }
    }
    handlePageClick = ({ selected }) => {
        this.setState({
            currentPage: selected
        });
    };
    handleOpenView = (data) => {
        this.setState({
            dataTransaction: data,
            isOpenView: true,
        })
    }
    handleCloseView = () => {
        this.setState({
            isOpenView: false,
            dataTransaction: []
        })
    }
    selectSearch = (e, id) => {
        let valueInput = e.target.value;
        let coppyState = { ...this.state };
        coppyState[id] = valueInput;
        this.setState({
            ...coppyState
        })
    }

    handleKeyDownEmail = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.setState({
                searchEmail: event.target.value
            })
        }
    }
    handleKeyDownTransaction = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.setState({
                searchTransaction: event.target.value
            })
        }
    }
    render() {
        let { currentPage, perPage, listOrder, searchPTTT,
            searchTransaction, searchEmail } = this.state;
        let searchListOrder = listOrder.filter((item) => {
            return searchPTTT === '' ?
                item :
                item.typePayment.includes(searchPTTT);
        }).filter((item) => {
            return searchEmail.toLowerCase() === '' ?
                item :
                item.email.toLowerCase().includes(searchEmail.toLowerCase());
        }).filter((item) => {
            return searchTransaction.toLowerCase() === '' ?
                item :
                item.transactionId.toLowerCase().includes(searchTransaction.toLowerCase());
        })

        let offset = currentPage * perPage;
        let pageCount = Math.ceil(searchListOrder.length / perPage);
        let currentPageData = searchListOrder.slice(offset, offset + perPage);
        return (
            <div className="danh-sach-don-hang">
                <div className="title-danh-sach-don-hang">
                    Danh Sách Đơn Hàng Bị Hủy
                </div>
                <div className="search-input">
                    <input
                        className="form-control md-3"
                        placeholder="Tìm kiếm theo mã đơn hàng"
                        onKeyDown={(e) => this.handleKeyDownTransaction(e)}
                    />
                    <input
                        className="form-control md-3"
                        placeholder="Tìm kiếm theo email"
                        onKeyDown={(e) => this.handleKeyDownEmail(e)}
                    />
                    <Select
                        value={searchPTTT}
                        onChange={(e) => this.selectSearch(e, "searchPTTT")}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        className="form-control"
                        defaultValue={""}
                    >
                        <MenuItem value={""}>Tất Cả</MenuItem>
                        <MenuItem value="" hidden={true}>
                            Tìm kiếm theo phương thức thanh toán
                        </MenuItem>
                        <MenuItem value={"cashonreceipt"}>Thanh toán khi nhận hàng</MenuItem>
                        <MenuItem value={"paypal"}>Paypal</MenuItem>
                    </Select>
                </div>
                <div className="table-danh-sach-don-hang">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã Đơn Hàng</th>
                                <th>Email</th>
                                <th>Số Điện Thoại</th>
                                <th>Ngày Đặt</th>
                                <th>PTTT</th>
                                <th>Xem Chi Tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ width: 300 }}>{item.transactionId}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phonenumber}</td>
                                    <td>
                                        {moment(item.updatedAt).format('DD/MM/YYYY')}
                                    </td>
                                    <td>{item.typePayment}</td>
                                    <td className="action-btn">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => this.handleOpenView(item)}
                                        ><SearchIcon /></button>
                                    </td>
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
                <ModalViewOrder
                    handleCloseView={this.handleCloseView}
                    isOpenModal={this.state.isOpenView}
                    data={this.state.dataTransaction}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ListCancelOrder);
