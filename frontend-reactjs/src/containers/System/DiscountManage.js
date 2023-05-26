import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';
import './DiscountManage.scss'
import Select from 'react-select';
import {
    getDataSelectProduct, createPaintDiscount, getAllPaintDiscount, deletePaintDiscount,
    updatePaintDiscount
}
    from '../../services/userService';
import moment from 'moment';

class DiscountManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionHTML: '',
            descriptionMarkdown: '',
            listSelectPaint: [],
            selectedPaint: '',
            action: 'CREATE',
            startDate: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            endDate: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            valueDiscount: 0,
            listDiscount: [],
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
            id: 0,
            paintId: ''
        };
    }
    async componentDidMount() {
        let getData = await getDataSelectProduct();
        if (getData && getData.data.length > 0) {
            this.setState({
                listSelectPaint: this.buildDataInputSelect(getData.data)
            })
        }
    }

    getDataDiscount = async (paintId) => {
        let getData = await getAllPaintDiscount(paintId);
        this.setState({
            listDiscount: getData.data
        })
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.paintName;
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
            ...stateCopy,
            action: 'CREATE'
        })
        this.getDataDiscount(selectedOption.value)
    }

    handleStartDateChange = (event) => {
        let newStartDate = event.target.value;
        let { endDate } = this.state;

        let startDateTime = new Date();
        let endDateTime = new Date(newStartDate);

        if (startDateTime.toISOString() > endDateTime.toISOString()) {
            return; // Không cập nhật giá trị nếu endDate nhỏ hơn startDate
        }

        if (endDate && newStartDate > endDate) {
            this.setState({
                startDate: newStartDate,
                endDate: newStartDate
            });
        } else {
            this.setState({ startDate: newStartDate });
        }
    }

    handleEndDateChange = (event) => {
        let newEndDate = event.target.value;
        let { startDate } = this.state;

        let startDateTime = new Date(startDate);
        let endDateTime = new Date(newEndDate);

        if (startDateTime.toISOString() > endDateTime.toISOString()) {
            return; // Không cập nhật giá trị nếu endDate nhỏ hơn startDate
        }

        this.setState({ endDate: newEndDate });
    }
    onChangeValueDiscount = (e) => {
        this.setState({
            valueDiscount: e.target.value.replace(/^0+/, '')
        })
    }
    onBlurValueDiscount = () => {
        if (this.state.valueDiscount < 0) {
            this.setState({
                valueDiscount: 0
            })
        } else if (this.state.valueDiscount > 100) {
            this.setState({
                valueDiscount: 100
            })
        }
    }
    handleSaveDiscount = async () => {
        let { startDate, endDate, valueDiscount, selectedPaint, action, id, paintId } = this.state;
        let newStartDate = new Date(startDate);
        let newEndDate = new Date(endDate);

        if (!selectedPaint) {
            alert("Vui lòng chọn sản phẩm!")
            return
        }

        if (newEndDate - newStartDate <= 0) {
            alert("Có gì đó sai sai về ngày giờ!")
            return
        }

        if (valueDiscount === 0) {
            alert("Vui lòng điền phần trăm khuyến mãi!")
            return
        }

        if (action === 'CREATE') {
            let rescreate = await createPaintDiscount({
                paintId: selectedPaint.value,
                startDate: startDate,
                endDate: endDate,
                valueDiscount: valueDiscount
            });
            if (rescreate && rescreate.errCode === 0) {
                this.setState({
                    startDate: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
                    endDate: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
                    valueDiscount: 0
                })
                toast.success("Cập Nhật Khuyến Mãi Thành Công")
                this.getDataDiscount(selectedPaint.value);
            } else {
                toast.error("Thời Gian Của Bạn Đã Bị Trùng")
            }
        } else if (action === 'EDIT') {
            let resUpdate = await updatePaintDiscount({
                id: id,
                paintId: paintId,
                startDate: startDate,
                endDate: endDate,
                valueDiscount: valueDiscount
            })
            if (resUpdate && resUpdate.errCode === 0) {
                this.setState({
                    startDate: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
                    endDate: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
                    valueDiscount: 0,
                    action: 'CREATE',
                    id: 0,
                    paintId: ''
                })
                toast.success("Cập Nhật Thành Công")
                this.getDataDiscount(selectedPaint.value);
            } else {
                toast.error("Thời Gian Của Bạn Đã Bị Trùng")
            }
        }
    }

    handleUpdateDiscount = (data) => {
        this.setState({
            startDate: moment(data.startDate).format('YYYY-MM-DDTHH:mm'),
            endDate: moment(data.endDate).format('YYYY-MM-DDTHH:mm'),
            action: 'EDIT',
            valueDiscount: data.valueDiscount,
            id: data.id,
            paintId: data.paintId
        })
    }
    cancelUpdate = () => {
        this.setState({
            startDate: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            endDate: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            action: 'CREATE',
            valueDiscount: 0
        })
    }
    handleDeleteDiscount = async (id) => {
        if (window.confirm('Bạn muốn xóa gói khuyến mãi này?')) {
            let deleteDiscount = await deletePaintDiscount(id);
            if (deleteDiscount && deleteDiscount.errCode === 0) {
                this.getDataDiscount(this.state.selectedPaint.value);
                toast.success("Xóa Thành Công!")
            }
        } else {
            // xử lý khi chọn No
        }
    }

    render() {
        let { startDate, endDate, valueDiscount, listDiscount, currentPage, perPage, action }
            = this.state;
        let offset = currentPage * perPage;
        let pageCount = Math.ceil(listDiscount.length / perPage);
        let currentPageData = listDiscount.slice(offset, offset + perPage);
        return (
            <div className="discount-container">
                <div className="discount-title">
                    Quản Lý Khuyến Mãi
                </div>
                <div className="discount-select">
                    <label>Chọn Sản Phẩm:</label>
                    <Select
                        value={this.state.selectedPaint}
                        onChange={this.handleChangeSelect}
                        options={this.state.listSelectPaint}
                        name="selectedPaint"
                    />
                </div>
                <div className="date-range-picker-container">
                    <div>
                        <label>Start Date and Time:</label>
                        <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(event) => this.handleStartDateChange(event)}
                            min={moment(new Date()).format('YYYY-MM-DDTHH:mm')}
                        />
                    </div>
                    <div>
                        <label>End Date and Time:</label>
                        <input
                            type="datetime-local"
                            value={endDate}
                            onChange={(event) => this.handleEndDateChange(event)}
                            min={moment(startDate).format('YYYY-MM-DDTHH:mm')}
                        />
                    </div>
                </div>
                <div className="discount-input">
                    <label>Khuyến Mãi (%) :</label>
                    <input
                        type="number"
                        className="form-control"
                        onChange={(e) => this.onChangeValueDiscount(e)}
                        value={valueDiscount}
                        onBlur={() => this.onBlurValueDiscount()}
                    />
                </div>
                <div className="discount-action">
                    <button
                        className={
                            action === "CREATE" ?
                                "btn btn-primary btn-range-date" :
                                "btn btn-success btn-range-date"
                        }
                        onClick={() => this.handleSaveDiscount()}
                    >
                        {action === "CREATE" ? "Lưu" : "Cập nhật"}

                    </button>
                    {
                        action === 'EDIT' ?
                            <button
                                className="btn btn-secondary btn-range-date"
                                onClick={() => this.cancelUpdate()}
                            >Hủy</button> :
                            ""
                    }
                </div>
                <div className="table-discount">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: "25%" }}>Ngày bắt đầu</th>
                                <th style={{ width: "25%" }}>Ngày kết thúc</th>
                                <th style={{ width: "25%" }}>Khuyến mãi (%)</th>
                                <th style={{ width: "25%" }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentPageData.length > 0 ?
                                    currentPageData.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ width: 200 }}>
                                                {moment(item.startDate).format("HH:mm DD/MM/YYYY")}
                                            </td>
                                            <td>
                                                {moment(item.endDate).format("HH:mm DD/MM/YYYY")}
                                            </td>
                                            <td>{item.valueDiscount}</td>
                                            {
                                                item.isUpdate === true ?
                                                    <td className="action-btn">
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() => this.handleDeleteDiscount(item.id)}
                                                        >Xóa</button>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => this.handleUpdateDiscount(item)}
                                                        >Chỉnh sửa</button>
                                                    </td>
                                                    : <td></td>
                                            }
                                        </tr>
                                    )) :
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "center" }}>
                                            Trống
                                        </td>
                                    </tr>
                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(DiscountManage);
