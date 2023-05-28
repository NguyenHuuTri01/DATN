import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from 'react-paginate';
import { nhanGiaCongById, hoanThanh } from '../../services/userService';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { toast } from "react-toastify";
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
class ListGiaCong extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listGiaCong: [],
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
            isOpen: false,
            dataModal: ''
        };
    }
    async componentDidMount() {
        let res = await nhanGiaCongById({
            constructorId: this.props.userInfo.id
        });
        if (res && res.errCode === 0) {
            this.setState({
                listGiaCong: res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {

    }
    viewRequire = (require) => {
        this.setState({
            isOpen: true,
            dataModal: require
        })
    }
    viewAddress = (address) => {
        this.setState({
            isOpen: true,
            dataModal: address
        })
    }
    handleClose = () => {
        this.setState({
            isOpen: false
        })
    }
    handleTakeMachining = async (id) => {
        if (window.confirm('Đã Kí Hợp Đồng?')) {
            let nhangiacong = await hoanThanh({
                constructorId: this.props.userInfo.id,
                id: id,
                status: 'xong'
            })
            if (nhangiacong && nhangiacong.errCode === 0) {
                let res = await nhanGiaCongById({
                    constructorId: this.props.userInfo.id
                });
                if (res && res.errCode === 0) {
                    this.setState({
                        listGiaCong: res.data
                    })
                }
                toast.success("Thành Công.")
            } else {
                let res = await nhanGiaCongById({
                    constructorId: this.props.userInfo.id
                });
                if (res && res.errCode === 0) {
                    this.setState({
                        listGiaCong: res.data
                    })
                }
                toast.error("Thất Bại.")
            }
        } else {
            // xử lý khi chọn No
        }

    }
    handleCancelMachining = async (id) => {
        if (window.confirm('Người Dùng Không Kí Hợp Đồng?')) {
            let nhangiacong = await hoanThanh({
                constructorId: this.props.userInfo.id,
                id: id,
                status: 'cancel'
            })
            if (nhangiacong && nhangiacong.errCode === 0) {
                let res = await nhanGiaCongById({
                    constructorId: this.props.userInfo.id
                });
                if (res && res.errCode === 0) {
                    this.setState({
                        listGiaCong: res.data
                    })
                }
            } else {
                let res = await nhanGiaCongById({
                    constructorId: this.props.userInfo.id
                });
                if (res && res.errCode === 0) {
                    this.setState({
                        listGiaCong: res.data
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
                <div className="table-gia-cong">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên Khách Hàng</th>
                                <th>Số Điện Thoại</th>
                                <th>Email</th>
                                <th>Loại Công Trình</th>
                                <th>Diện Tích</th>
                                <th>Địa Chỉ</th>
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
                                    <td className="design-center">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => this.viewAddress(item.address)}
                                        >
                                            <SearchIcon />
                                        </button>
                                    </td>
                                    <td className="design-center">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => this.viewRequire(item.require)}
                                        >
                                            <SearchIcon />
                                        </button>
                                    </td>
                                    <td className="design-center">
                                        {
                                            item.status !== 'datiepnhan' ? item.status :
                                                <div>
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => this.handleTakeMachining(item.id)}
                                                    ><DoneIcon /></button>
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={() => this.handleCancelMachining(item.id)}
                                                    ><CancelIcon /></button>
                                                </div>
                                        }
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
                <Modal
                    open={this.state.isOpen}
                    onClose={() => this.handleClose()}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{
                        ...style, width: 500, height: 400, textAlign: 'center', paddingTop: 10
                    }}>
                        {this.state.dataModal}
                    </Box>
                </Modal>
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
