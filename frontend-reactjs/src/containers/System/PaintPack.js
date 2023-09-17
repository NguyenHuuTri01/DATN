import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import './PaintPack.scss';
import {
    createPaintPack, getAllPaintPack, deletePaintPack, updatePaintPack
} from '../../services/userService';
import ReactPaginate from 'react-paginate';

const mdParser = new MarkdownIt(/* Markdown-it options */);
class PaintPack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionHTML: '',
            descriptionMarkdown: '',
            name: '',
            listPaintPack: [], // Dữ liệu bảng
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
            action: 'CREATE',
            idPaintPack: 0,
        };
    }
    async componentDidMount() {
        this.getListPaintPack();
    }

    getListPaintPack = async () => {
        let getListPaintPack = await getAllPaintPack();
        if (getListPaintPack && getListPaintPack.errCode === 0) {
            this.setState({
                listPaintPack: getListPaintPack.data
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }


    handleSavePaintPack = async () => {
        if (this.state.action === 'CREATE') {
            let create = await createPaintPack({
                name: this.state.name,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown
            })
            if (create && create.errCode === 0) {
                this.setState({
                    name: '',
                    descriptionHTML: '',
                    descriptionMarkdown: ''
                })
                this.getListPaintPack();
                toast.success("Tạo Thành Công");
            } else if (create && create.errCode === -1) {
                toast.error("Gói Thi Công Đã Tồn Tại");
            } else {
                toast.error("Vui Lòng Điền Đầy Đủ Thông Tin");
            }
        } else {
            let update = await updatePaintPack({
                id: this.state.idPaintPack,
                name: this.state.name,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown
            })
            if (update && update.errCode === 0) {
                this.setState({
                    idPaintPack: 0,
                    name: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: 'CREATE'
                })
                this.getListPaintPack();
                toast.success("Cập Nhật Thông Tin Thành Công");
            } else if (update && update.errCode === 1) {
                toast.error("Vui Lòng Điền Đầy Đủ Thông Tin");
            }
        }
    }
    onChangeInput = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    handlePageClick = ({ selected }) => {
        this.setState({
            currentPage: selected
        });
    };
    deletePaintPack = async (id) => {
        if (window.confirm('Bạn muốn xóa gói thi công này?')) {
            let resDelete = await deletePaintPack(id);
            if (resDelete && resDelete.errCode === 0) {
                this.getListPaintPack();
                toast.success("Xóa Thành Công!")
            }
        } else {
            // xử lý khi chọn No
        }
    }
    updatePaintPack = (data) => {
        this.setState({
            idPaintPack: data.id,
            name: data.name,
            descriptionHTML: data.contentHTML,
            descriptionMarkdown: data.contentMarkdown,
            action: 'UPDATE'
        })
    }
    handleCancelUpdate = () => {
        this.setState({
            idPaintPack: 0,
            name: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            action: 'CREATE'
        })
    }
    render() {
        let { listPaintPack, currentPage, perPage, action } = this.state;
        let offset = currentPage * perPage;
        let pageCount = Math.ceil(listPaintPack.length / perPage);
        let currentPageData = listPaintPack.slice(offset, offset + perPage);
        return (
            <div className="paint-pack-container">
                <div className="paint-pack-title">
                    Các Gói Gia Công
                </div>
                <div className="paint-pack-name">
                    <label>Tên Gói Thầu:</label>
                    <input
                        className="form-control md-12"
                        value={this.state.name}
                        onChange={(e) => this.onChangeInput(e)}
                    />
                </div>
                <label>Nhập Thông Tin</label>
                <MdEditor
                    style={{ height: "400px" }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={this.handleEditorChange}
                    value={this.state.descriptionMarkdown}
                />
                <button
                    className="btn btn-primary btn-save"
                    onClick={() => this.handleSavePaintPack()}
                >
                    {action === 'UPDATE' ? 'Lưu' : 'Tạo mới'}
                </button>
                {
                    action === 'UPDATE' ?
                        <button
                            className="btn btn-secondary btn-cancel"
                            onClick={() => this.handleCancelUpdate()}
                        >
                            Hủy
                        </button>
                        : ''
                }
                <div className="table-list-paint-pack">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên gói thi công</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td className="action-btn">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => this.deletePaintPack(item.id)}
                                        >Xóa</button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => this.updatePaintPack(item)}
                                        >Chỉnh sửa</button>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PaintPack);
