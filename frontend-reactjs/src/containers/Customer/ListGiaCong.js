import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllTransaction, updateTransport } from '../../services/userService';
import ReactPaginate from 'react-paginate';
import moment from 'moment';

class ListGiaCong extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listGiaCong: [],
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
            isOpenView: false,
            dataTransaction: [],
        };
    }
    async componentDidMount() {
        let datalist = await getAllTransaction();
        if (datalist && datalist.errCode === 0) {
            this.setState({
                listGiaCong: datalist.data
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
    handleUpdateTransport = async (transactionId) => {
        if (window.confirm('Cập nhật tình trạng đang vận chuyển?')) {
            let isUpdate = await updateTransport({
                transactionId: transactionId,
                transportStatus: 'dang van chuyen'
            })
            if (isUpdate && isUpdate.errCode === 0) {
                let datalist = await getAllTransaction();
                if (datalist && datalist.errCode === 0) {
                    this.setState({
                        listGiaCong: datalist.data
                    })
                }
            }
        } else {
            // xử lý khi chọn No
        }
    }
    succeedTransport = async (transactionId) => {
        if (window.confirm('Đã giao hàng?')) {
            let isUpdate = await updateTransport({
                transactionId: transactionId,
                transportStatus: 'da giao hang'
            })
            if (isUpdate && isUpdate.errCode === 0) {
                let datalist = await getAllTransaction();
                if (datalist && datalist.errCode === 0) {
                    this.setState({
                        listGiaCong: datalist.data
                    })
                }
            }
        } else {
            // xử lý khi chọn No
        }
    }
    render() {

        let { currentPage, perPage, listGiaCong } = this.state;
        let offset = currentPage * perPage;
        let pageCount = Math.ceil(listGiaCong.length / perPage);
        let currentPageData = listGiaCong.slice(offset, offset + perPage);

        return (
            <div className="danh-sach-don-thue-gia-cong">
                <div className="title-gia-cong">
                    Danh Sách Đơn Thuê Gia Công
                </div>
                <div>
                    <input placeholder="Tìm Kiếm" />
                </div>
                <div className="table-gia-cong">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên Khách Hàng</th>
                                <th>Số Điện Thoại</th>
                                <th>Email</th>
                                <th>Loại Công Trình</th>
                                <th>Diện Tích</th>
                                <th>Màu Mong Muốn</th>
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListGiaCong);
