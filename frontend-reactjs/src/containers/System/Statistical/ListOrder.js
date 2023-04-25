import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllTransaction } from '../../../services/userService';
import ReactPaginate from 'react-paginate';
import './ListOrder.scss';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import ModalViewOrder from "./ModalViewOrder";

class ListOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOrder: [],
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
            isOpenView: false,
            dataTransaction: []
        };
    }
    async componentDidMount() {
        let datalist = await getAllTransaction();
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

    render() {
        let { currentPage, perPage, listOrder } = this.state;
        let offset = currentPage * perPage;
        let pageCount = Math.ceil(listOrder.length / perPage);
        let currentPageData = listOrder.slice(offset, offset + perPage);
        return (
            <div className="danh-sach-don-hang">
                <div className="title-danh-sach-don-hang">
                    Danh Sách Đơn Hàng
                </div>
                <div>
                    <input placeholder="Tìm Kiếm" />
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
                                <th>Tình Trạng Giao Hàng</th>
                                <th>Action</th>
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
                                    <td>{item.transportStatus}</td>
                                    <td className="action-btn">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => this.handleOpenView(item)}
                                        ><SearchIcon /></button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => this.handleUpdate()}
                                        ><EditIcon /></button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ListOrder);
