import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import './DiscountManage.scss'
import Select from 'react-select';
import { getDataSelectProduct } from '../../services/userService';

class DiscountManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionHTML: '',
            descriptionMarkdown: '',
            listSelectPaint: [],
            selectedPaint: '',
            action: 'CREATE',
            startDate: new Date(),
            endDate: new Date()
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

    }

    handleStartDateChange = (event) => {
        let newStartDate = event.target.value;
        let { endDate } = this.state;

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

    render() {
        let { startDate, endDate } = this.state;
        // Tách ngày và thời gian từ startDate
        let startDateTime = new Date(startDate);
        let startDateString = startDateTime.toISOString().split("T")[0];
        let startTimeString = startDateTime.toISOString().split("T")[1].substring(0, 5);

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
                        />
                    </div>
                    <div>
                        <label>End Date and Time:</label>
                        <input
                            type="datetime-local"
                            value={endDate}
                            onChange={(event) => this.handleEndDateChange(event)}
                            min={`${startDateString}T${startTimeString}`}
                        />
                    </div>
                </div>
                <div className="discount-action">
                    <button className="btn btn-primary btn-range-date">Lưu</button>
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
