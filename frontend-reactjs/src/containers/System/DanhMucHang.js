import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from 'react-paginate';
import {
  createLoaiSon, getAllLoaiSon, delelteLoaiSon, editLoaiSon
} from '../../services/userService';
import './DanhMucHang.scss';
import { toast } from "react-toastify";

class DanhMucHang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [], // Dữ liệu bảng
      currentPage: 0, // Số trang hiện tại
      perPage: 10, // Số phần tử trên một trang
      paintId: '',
      name: '',
      action: "CREATE"
    };
  }
  async componentDidMount() {
    this.getAllLoaiSon()
  }

  getAllLoaiSon = async () => {
    let resgetall = await getAllLoaiSon();
    if (resgetall && resgetall.errCode === 0) {
      this.setState({
        tableData: [...resgetall.data]
      })
    }
  }

  // Hàm xử lý khi người dùng chọn trang
  handlePageClick = ({ selected }) => {
    this.setState({
      currentPage: selected
    });
  };

  handleOnChangeInput = (e, id) => {
    let valueInput = e.target.value;
    let coppyState = { ...this.state };
    coppyState[id] = valueInput;
    this.setState({
      ...coppyState
    })
  }
  CreateLoaiSon = async () => {
    let { name, paintId, action } = this.state;
    if (!name || !paintId) {
      alert("Vui lòng nhập đủ thông tin")
      return;
    }
    if (action === "CREATE") {
      let resCreate = await createLoaiSon({
        name: name,
        paintId: paintId
      })
      if (resCreate && resCreate.errCode === 0) {
        toast.success('Tạo Thành Công!');
        this.setState({
          name: '',
          paintId: ''
        })
        this.getAllLoaiSon();
      } else if (resCreate.errCode === -1) {
        toast.error('Mã danh mục đã tồn tại!');
      }
    } else {
      let resEdit = await editLoaiSon({
        paintId: paintId,
        name: name
      })
      if (resEdit && resEdit.errCode === 0) {
        toast.success('Cập Nhật Thành Công!');
        this.setState({
          paintId: '',
          name: '',
          action: "CREATE"
        })
        this.getAllLoaiSon();
      }
    }
  }
  handleUpdate = (data) => {
    this.setState({
      paintId: data.paintId,
      name: data.name,
      action: "EDIT"
    })
  }
  handleDelete = async (paintId) => {
    if (window.confirm('Bạn muốn xóa danh mục này?')) {
      let resDelete = await delelteLoaiSon({
        paintId: paintId
      })
      if (resDelete && resDelete.errCode === 0) {
        toast.success('Xóa Thành Công!');
        this.getAllLoaiSon();
      }
    } else {
      // xử lý khi chọn No
    }
  }
  CancelUpdate = () => {

    this.setState({
      paintId: '',
      name: '',
      action: "CREATE"
    })
  }
  render() {
    let { tableData, currentPage, perPage, name, paintId, action } = this.state;
    let offset = currentPage * perPage;
    let pageCount = Math.ceil(tableData.length / perPage);
    let currentPageData = tableData.slice(offset, offset + perPage);

    return (
      <>
        {
          this.props.userInfo.roleId === 'R3' || this.props.userInfo.roleId === "R1" ?
            <>
              <div className="danhmuchang-top-container">
                <div className="title-qldmh">Quản Lý Danh Mục Hàng</div>
                <div className="danhmuchang-top-content">
                  <label>Mã Danh Mục</label>
                  <input
                    className="form-control"
                    value={paintId}
                    onChange={(e) => this.handleOnChangeInput(e, "paintId")}
                    disabled={action === "CREATE" ? false : true}
                  />
                  <label>Tên Danh Mục</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => this.handleOnChangeInput(e, "name")}
                  />
                  <button
                    className="btn btn-primary btn-save"
                    onClick={() => this.CreateLoaiSon()}
                  >
                    {action === "CREATE" ? "Tạo" : "Lưu"}
                  </button>
                  {
                    action === "CREATE" ? '' :
                      <button
                        className="btn btn-secondary btn-huy"
                        onClick={() => this.CancelUpdate()}
                      >
                        Hủy
                      </button>
                  }
                </div>
              </div>
              <div className="table-danhmuchang">
                <table>
                  <thead>
                    <tr>
                      <th>Mã danh mục</th>
                      <th>Tên danh mục</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageData.map((item, index) => (
                      <tr key={index}>
                        <td style={{ width: 200 }}>{item.paintId}</td>
                        <td>{item.name}</td>
                        <td className="action-btn">
                          <button
                            className="btn btn-secondary"
                            onClick={() => this.handleDelete(item.paintId)}
                          >Xóa</button>
                          <button
                            className="btn btn-primary"
                            onClick={() => this.handleUpdate(item)}
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
            </> :
            <div></div>
        }
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DanhMucHang);
