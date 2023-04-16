import React, { Component } from "react";
import { connect } from "react-redux";
import ReactPaginate from 'react-paginate';
import './DanhMucHang.scss';

class DanhMucHang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [], // Dữ liệu bảng
      currentPage: 0, // Số trang hiện tại
      perPage: 10, // Số phần tử trên một trang
      paintId: '',
      name: ''
    };
  }
  componentDidMount() {

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

  render() {

    let datatable = [
      {
        id: '001',
        name: 'Sơn dự án'
      }, {
        id: '002',
        name: 'Sơn dự án'
      }, {
        id: '003',
        name: 'Sơn dự án'
      }, {
        id: '004',
        name: 'Sơn dự án'
      }, {
        id: '005',
        name: 'Sơn dự án'
      }, {
        id: '006',
        name: 'Sơn dự án'
      }, {
        id: '007',
        name: 'Sơn dự án'
      }, {
        id: '008',
        name: 'Sơn dự án'
      }, {
        id: '009',
        name: 'Sơn dự án'
      }, {
        id: '0010',
        name: 'Sơn dự án'
      }, {
        id: '0011',
        name: 'Sơn dự án'
      },
    ]

    let { tableData, currentPage, perPage, name, paintId } = this.state;
    let offset = currentPage * perPage;
    let pageCount = Math.ceil(datatable.length / perPage);
    let currentPageData = datatable.slice(offset, offset + perPage);

    return (
      <>
        <div className="danhmuchang-top-container">
          <div className="danhmuchang-top-content">
            <label>Mã Danh Mục</label>
            <input
              className="form-control"
              value={paintId}
              onChange={(e) => this.handleOnChangeInput(e, "paintId")}
            />
            <label>Tên Danh Mục</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => this.handleOnChangeInput(e, "name")}
            />
            <button className="btn btn-primary btn-save">Lưu</button>
          </div>
        </div>
        <div className="table-danhmuchang">
          <table>
            <thead>
              <tr>
                <th>Paint ID</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: 200 }}>{item.id}</td>
                  <td>{item.name}</td>
                  <td className="action-btn">
                    <button className="btn btn-secondary">Delete</button>
                    <button className="btn btn-primary">Update</button>
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
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DanhMucHang);
