import React, { Component } from "react";
import { connect } from "react-redux";
import "./PaintManage.scss";
import { CommonUtils } from "../../utils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import Select from 'react-select';
import { toast } from "react-toastify";
import {
  getAllLoaiSon, createPaintProduct, getAllPaintProduct,
  editPaintProduct, deleltePaintProduct
} from '../../services/userService';
import ReactPaginate from 'react-paginate';

class PaintManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageBase64: '',
      previewImgURL: '',
      isOpen: false,
      paintId: '',
      name: '',
      price: 0,
      discount: 0,
      quantity: 0,
      catelogy: [],
      selectedCatelory: '',
      description: '',
      action: 'CREATE',

      allProduct: [], // Dữ liệu bảng
      currentPage: 0, // Số trang hiện tại
      perPage: 10, // Số phần tử trên một trang
      disablePaintId: false,
    };
  }

  async componentDidMount() {
    let allCatelogy = await getAllLoaiSon();
    if (allCatelogy && allCatelogy.data.length > 0) {
      this.setState({
        catelogy: this.buildDataInputSelect(allCatelogy.data)
      })
    }
    this.getListPaintProduct();
  }

  getListPaintProduct = async () => {
    let data = await getAllPaintProduct();
    if (data && data.errCode === 0) {
      this.setState({
        allProduct: [...data.data]
      })
    }
  }

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };
  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        imageBase64: base64,
        previewImgURL: objectUrl
      });
    }
  };
  onChangeInput = (event, id) => {
    let valueInput = event.target.value.replace(/^0+/, '');
    let stateCopy = { ...this.state }
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy
    })
  }
  buildDataInputSelect = (inputData) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        object.label = item.name;
        object.value = item.paintId;
        result.push(object);
        return result;
      })
    }
    return result;
  }
  handleChangeSelect = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy
    })
  }

  handleCreatePaintProduct = async () => {
    let {
      paintId, name, price, quantity, selectedCatelory, imageBase64, action
    } = this.state;
    if (
      !paintId || !name || !selectedCatelory || !imageBase64
    ) {
      alert('Vui Lòng Nhập Đầy Đủ Thông Tin')
      return
    }

    if (!price) {
      alert('Vui Lòng Nhập Giá Tiền')
      return
    }
    if (action === 'CREATE') {
      let resCreatePaint = await createPaintProduct({
        paintId: paintId,
        paintName: name,
        paintPrice: price,
        // paintDiscount: discount,
        paintQuantity: quantity,
        paintCatelory: selectedCatelory.value,
        // paintDescription: description,
        imageBase64: imageBase64,
      })

      if (resCreatePaint && resCreatePaint.errCode === -2) {
        toast.error('Sản Phẩm Đã Tồn Tại!');
      } else if (resCreatePaint && resCreatePaint.errCode === 0) {
        this.getListPaintProduct();
        toast.success('Tạo Sản Phẩm Thành Công!');
        this.setState({
          imageBase64: '',
          previewImgURL: '',
          paintId: '',
          name: '',
          price: 0,
          // discount: 0,
          quantity: 0,
          selectedCatelory: '',
          // description: '',
        })
      }
    } else {
      let resUpdatePaint = await editPaintProduct({
        paintId: paintId,
        paintName: name,
        paintPrice: price,
        // paintDiscount: discount,
        paintQuantity: quantity,
        paintCatelory: selectedCatelory.value,
        // paintDescription: description,
        imageBase64: imageBase64,
      })
      if (resUpdatePaint && resUpdatePaint.errCode === 0) {
        this.getListPaintProduct();
        toast.success('Cập Nhật Sản Phẩm Thành Công!');
        this.setState({
          imageBase64: '',
          previewImgURL: '',
          paintId: '',
          name: '',
          price: 0,
          // discount: 0,
          quantity: 0,
          selectedCatelory: '',
          // description: '',
          action: 'CREATE',
          disablePaintId: false,
        })
      }
    }
  }
  handleUpdate = (itemData) => {
    let { catelogy } = this.state;
    let cateloryId = itemData.paintCatelory;
    let selectedCatelory = catelogy.find(item => {
      return item && item.value === cateloryId
    })

    this.setState({
      imageBase64: itemData.image,
      paintId: itemData.paintId,
      name: itemData.paintName,
      price: itemData.paintPrice,
      // discount: itemData.paintDiscount,
      quantity: itemData.paintQuantity,
      selectedCatelory: selectedCatelory,
      // description: itemData.paintDescription,
      previewImgURL: itemData.image,
      action: 'EDIT',
      disablePaintId: true,
    })
  }

  handleCancelChangeProduct = () => {
    this.setState({
      imageBase64: '',
      paintId: '',
      name: '',
      price: 0,
      // discount: 0,
      quantity: 0,
      selectedCatelory: '',
      // description: '',
      previewImgURL: '',
      action: 'CREATE',
      disablePaintId: false,
    })
  }

  handleDelete = async (paintId) => {
    if (window.confirm('Bạn muốn xóa mặt hàng này?')) {
      let resDelete = await deleltePaintProduct(paintId);
      if (resDelete && resDelete.errCode === 0) {
        this.getListPaintProduct();
        toast.success("Xóa Thành Công!")
      }
    } else {
      // xử lý khi chọn No
    }
  }
  handlePageClick = ({ selected }) => {
    this.setState({
      currentPage: selected
    });
  };

  onBlurValueQuantity = () => {
    if (this.state.quantity > 0) {
      if (Number.isInteger(this.state.quantity)) {
        alert('Số lượng phải là số nguyên!')
        this.setState({
          quantity: Math.floor(this.state.quantity)
        })
      }
    }
  }
  handleKeyDownSearch = (event, id) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      let valueInput = event.target.value;
      let stateCopy = { ...this.state }
      stateCopy[id] = valueInput;
      this.setState({
        ...stateCopy
      })
    }
  }

  render() {
    let { paintId, name, price, quantity, catelogy,
      selectedCatelory, action, currentPage, perPage, allProduct, disablePaintId }
      = this.state;
    let offset = currentPage * perPage;
    let pageCount = Math.ceil(allProduct.length / perPage);
    let currentPageData = allProduct.slice(offset, offset + perPage);

    return (
      <div className="paint-container">
        <div className="title-qlsp">Quản Lý Sản Phẩm</div>
        <div className="form-group">
          <div className="col-3">
            <label>Mã Sơn:</label>
            <div>
              <input
                className="form-control"
                value={paintId}
                onChange={(e) => this.onChangeInput(e, "paintId")}
                disabled={disablePaintId}
              />
            </div>
          </div>
          <div className="col-3">
            <label>Tên Sơn:</label>
            <div>
              <input
                className="form-control"
                value={name}
                onChange={(e) => this.onChangeInput(e, "name")}
              />
            </div>
          </div>
          <div className="col-3">
            <label>Giá Tiền:</label>
            <div>
              <input
                className="form-control"
                value={price}
                min={0}
                type="number"
                onChange={(e) => this.onChangeInput(e, "price")}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-3">
            <label>Số Lượng:</label>
            <div>
              <input
                className="form-control"
                value={quantity}
                type="number"
                min={0}
                onChange={(e) => this.onChangeInput(e, "quantity")}
                onBlur={() => this.onBlurValueQuantity()}
              />
            </div>
          </div>
          <div className="col-3">
            <label>Loại:</label>
            <div>
              <Select
                value={selectedCatelory}
                onChange={this.handleChangeSelect}
                options={catelogy}
                name="selectedCatelory"
              />
            </div>
          </div>
          <div className="col-6">
            <label>Ảnh:</label>
            <div className="preview-img-container">
              <input
                id="previewImg"
                type="file"
                hidden
                onChange={(event) => this.handleOnChangeImage(event)}
              />
              <label className="label-upload" htmlFor="previewImg">
                Tải ảnh <i className="fas fa-upload"></i>
              </label>
              <div
                className="preview-image"
                style={{
                  backgroundImage: `url(${this.state.previewImgURL})`,
                }}
                onClick={() => this.openPreviewImage()}
              ></div>
            </div>
          </div>
        </div>
        <div className="btn-create-product">
          {
            action === "CREATE" ?
              <button
                className="btn btn-primary"
                onClick={() => this.handleCreatePaintProduct()}
              >Tạo</button>
              :
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => this.handleCreatePaintProduct()}
                >Lưu</button>
                <button
                  className="btn btn-secondary"
                  onClick={() => this.handleCancelChangeProduct()}
                >Hủy</button>
              </>
          }
        </div>

        <div className="table-danhmuchang">
          <table>
            <thead>
              <tr>
                <th>Mã Mặt Hàng</th>
                <th>Tên</th>
                <th>Số Lượng</th>
                <th>Khuyến Mãi(%)</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: 200 }}>{item.paintId}</td>
                  <td>{item.paintName}</td>
                  <td>{item.paintQuantity}</td>
                  <td>{item.paintDiscount}</td>
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
        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PaintManage);
