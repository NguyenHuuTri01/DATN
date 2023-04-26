import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from 'react-paginate';
import { getGiaCong } from '../../../services/userService';
import SearchIcon from '@mui/icons-material/Search';

class ListMachining extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listGiaCong: [],
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
        };
    }
    async componentDidMount() {
        let res = await getGiaCong();
        if (res && res.errCode === 0) {
            this.setState({
                listGiaCong: res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {

    }
    viewRequire = () => {

    }
    render() {

        let { currentPage, perPage, listGiaCong } = this.state;
        let offset = currentPage * perPage;
        let pageCount = Math.ceil(listGiaCong.length / perPage);
        let currentPageData = listGiaCong.slice(offset, offset + perPage);
        console.log(listGiaCong)
        return (
            <div className="danh-sach-don-thue-gia-cong">
                <div className="title-gia-cong">
                    Danh Sách Đơn Thuê Gia Công
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
                                <th>Ngày Khởi Công</th>
                                <th>Ngày Hoàn Thành</th>
                                <th>Yêu Cầu Đặc Biệc</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.customerName}</td>
                                    <td>{item.phonenumber}</td>
                                    <td>{item.email}</td>
                                    <td>{item.loaiCongTrinh}</td>
                                    <td>{item.area}</td>
                                    <td>{item.color}</td>
                                    <td>{item.startDate}</td>
                                    <td>{item.endDate}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => this.viewRequire(item.require)}
                                        >
                                            <SearchIcon />
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-success">Nhận</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ListMachining);
