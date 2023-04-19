import React, { Component } from "react";
import { connect } from "react-redux";
import "./PaintManage.scss";
import { CommonUtils } from "../../utils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Select from 'react-select';
import { toast } from "react-toastify";
import { getAllLoaiSon, createPaintProduct } from '../../services/userService';

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
      selectedCatelogy: '',
      description: '',
      action: 'CREATE'
    };
  }

  async componentDidMount() {
    let allCatelogy = await getAllLoaiSon();
    if (allCatelogy && allCatelogy.data.length > 0) {
      this.setState({
        catelogy: this.buildDataInputSelect(allCatelogy.data)
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
    let valueInput = event.target.value;
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
      paintId, name, price, discount, quantity, selectedCatelogy, description, imageBase64, action
    } = this.state;
    if (
      !paintId || !name || !selectedCatelogy || !description || !imageBase64
    ) {
      alert('Vui Lòng Nhập Đầy Đủ Thông Tin')
      return
    }

    if (
      !price
    ) {
      alert('Vui Lòng Nhập Giá Tiền')
      return
    }

    if (quantity !== 0) {
      if (Number.isInteger(quantity)) {
        alert('Số lượng phải là số nguyên!')
        return
      }
    }
    if (action === 'CREATE') {
      let resCreatePaint = await createPaintProduct({
        paintId: paintId,
        paintName: name,
        paintPrice: price,
        paintDiscount: discount,
        paintQuantity: quantity,
        paintCatelory: selectedCatelogy.value,
        paintDescription: description,
        imageBase64: imageBase64,
      })
      console.log(resCreatePaint)
      if (resCreatePaint && resCreatePaint.errCode === -2) {
        toast.error('Sản Phẩm Đã Tồn Tại!');
      } else if (resCreatePaint && resCreatePaint.errCode === 0) {
        toast.success('Tạo Sản Phẩm Thành Công!');
        this.setState({
          imageBase64: '',
          previewImgURL: '',
          paintId: '',
          name: '',
          price: 0,
          discount: 0,
          quantity: 0,
          selectedCatelogy: '',
          description: '',
        })
      }
    } else {
      alert("update")
    }
  }

  render() {
    let { paintId, name, price, discount, quantity, catelogy, description,
      selectedCatelogy, action }
      = this.state;
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
          <div className="col-3">
            <label>{`Khuyến Mãi(%):`}</label>
            <div>
              <input
                className="form-control"
                type="number"
                min={0}
                value={discount}
                onChange={(e) => this.onChangeInput(e, "discount")}
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
              />
            </div>
          </div>
          <div className="col-3">
            <label>Loại:</label>
            <div>
              <Select
                value={selectedCatelogy}
                onChange={this.handleChangeSelect}
                options={catelogy}
                name="selectedCatelogy"
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
        <div className="col-12">
          <label>Mô Tả:</label>
          <div>
            <TextareaAutosize
              className="form-control"
              value={description}
              onChange={(e) => this.onChangeInput(e, "description")}
              minRows={5} />
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
              <button
                className="btn btn-primary"
                onClick={() => this.handleCreatePaintProduct()}
              >Lưu</button>
          }
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
