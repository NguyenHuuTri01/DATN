import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllPaintPack, getGiaCongById, cancelGiaCong } from '../../../services/userService';
import './ListPaintPacks.scss';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Machining from "./Machining";
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

class ListPaintPacks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listPaintPack: [],
            openModal: false,
            contentHTML: '',
            openRent: false,
            paintPackId: 0,
            lisSubmit: [],
            listGiaCong: [],
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
        };
    }
    async componentDidMount() {
        let res = await getAllPaintPack();
        if (res && res.errCode === 0) {
            this.setState({
                listPaintPack: res.data
            })
        }
        if (this.props.userInfo) {
            this.getListSubmit();
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {

    }
    getListSubmit = async () => {
        let resSubmit = await getGiaCongById(this.props.userInfo.id)
        this.setState({
            lisSubmit: resSubmit.data
        })
    }
    viewDetailPaintPack = (contentHTML) => {
        this.setState({
            openModal: true,
            contentHTML: contentHTML
        })
    }
    closeModal = () => {
        this.setState({
            openModal: false
        })
    }
    openRent = (id) => {
        this.setState({
            openRent: true,
            paintPackId: id
        })
    }
    closeRent = () => {
        this.setState({
            openRent: false
        })
    }
    cancelSubmit = async (id) => {
        if (window.confirm('Bạn Muốn Hủy Yêu Cầu Này?')) {
            let res = await cancelGiaCong({ id: id });
            if (res && res.errCode === 0) {
                toast.success('Hủy thành công!');
                this.getListSubmit();
            } else {
                toast.error('Hủy thất bại!');
            }
        } else {
            // xử lý khi chọn No
        }
    }

    render() {
        let { listPaintPack, openModal, contentHTML, openRent, paintPackId, lisSubmit,
            currentPage, perPage
        } = this.state;
        let offset = currentPage * perPage;
        let pageCount = Math.ceil(lisSubmit.length / perPage);
        let currentPageData = lisSubmit.slice(offset, offset + perPage);
        return (
            <div className="paint-pack-container">
                <div className="title-paint-pack">
                    Các gói gia công
                </div>
                <div className="list-paint-pack">
                    {
                        listPaintPack && listPaintPack.length > 0 &&
                        listPaintPack.map((item, index) => (
                            <div key={index} className="paint-pack-item">
                                <div className="item-name">
                                    {item.name}
                                </div>
                                <div className="item-icon">
                                    <span
                                        onClick={() => this.viewDetailPaintPack(item.contentHTML)}
                                    >
                                        <SearchIcon className="view-detail" />
                                    </span>
                                    <button
                                        className="btn-choose btn btn-primary"
                                        onClick={() => this.openRent(item.id)}
                                    >Thuê</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="list-submit">
                    {
                        this.props.userInfo &&
                        <div className="title-list-submit">
                            Danh Sách Các Yêu Cầu Đã Thực Hiện
                        </div>
                    }
                    {
                        this.props.userInfo &&
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Loại Công Trình</th>
                                        <th>Địa Chỉ</th>
                                        <th>Diện Tích</th>
                                        <th>Gói Gia Công</th>
                                        <th>Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.loaiCongTrinh}</td>
                                            <td>{item.address}</td>
                                            <td>{item.area}</td>
                                            <td>{item.dataPaintPack && item.dataPaintPack.name}</td>
                                            <td>
                                                {item.status === "pending" &&
                                                    <div className="item-status">
                                                        Đang chờ chủ thầu
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => this.cancelSubmit(item.id)}
                                                        >
                                                            Hủy
                                                        </button>
                                                    </div>
                                                }
                                                {item.status === "datiepnhan" && "Đã được tiếp nhận"}
                                                {item.status === "xong" && "Đã kí hợp đồng"}
                                                {item.status === "cancel" && "Đã hủy"}
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
                    }
                </div>
                <Modal
                    open={openModal}
                    onClose={() => this.closeModal()}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div dangerouslySetInnerHTML={{ __html: contentHTML }}>
                        </div>
                    </Box>
                </Modal>
                <Machining
                    openRent={openRent}
                    closeRent={this.closeRent}
                    paintPackId={paintPackId}
                    getListSubmit={this.getListSubmit}
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
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListPaintPacks);
