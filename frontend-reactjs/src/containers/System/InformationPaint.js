import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from 'react-select';
import './InformationPaint.scss';
import {
    getDataSelectProduct, createInformationPaint, updateInformationPaint,
    getInformationById
} from '../../services/userService'

const mdParser = new MarkdownIt(/* Markdown-it options */);
class InformationPaint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionHTML: '',
            descriptionMarkdown: '',
            listSelectPaint: [],
            selectedPaint: '',
            action: 'CREATE'
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

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
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
        let getdetail = await getInformationById(selectedOption.value);
        if (getdetail && getdetail.errCode === 0) {
            let stateName = name.name;
            let stateCopy = { ...this.state };
            stateCopy[stateName] = selectedOption;
            this.setState({
                ...stateCopy,
                descriptionHTML: getdetail.findPaint.contentHTML,
                descriptionMarkdown: getdetail.findPaint.contentMarkdown,
                action: 'EDIT'
            })
        } else {
            let stateName = name.name;
            let stateCopy = { ...this.state };
            stateCopy[stateName] = selectedOption;
            this.setState({
                ...stateCopy,
                descriptionHTML: '',
                descriptionMarkdown: '',
                action: 'CREATE'
            })
        }
    }
    handleSaveDetail = async () => {
        if (this.state.action === 'CREATE') {
            let create = await createInformationPaint({
                paintId: this.state.selectedPaint.value,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown
            })
            if (create && create.errCode === 0) {
                this.setState({
                    selectedPaint: '',
                    descriptionHTML: '',
                    descriptionMarkdown: ''
                })
                toast.success("Cập Nhật Thông Tin Thành Công");
            }
        } else {
            let create = await updateInformationPaint({
                paintId: this.state.selectedPaint.value,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown
            })
            if (create && create.errCode === 0) {
                this.setState({
                    selectedPaint: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: 'CREATE'
                })
                toast.success("Cập Nhật Thông Tin Thành Công");
            }
        }
    }
    render() {
        return (
            <div className="detail-container">
                <div className="detail-title">
                    Thông Tin Chi Tiết Của Sản Phẩm
                </div>
                <div className="detail-select">
                    <label>Chọn Sản Phẩm:</label>
                    <Select
                        value={this.state.selectedPaint}
                        onChange={this.handleChangeSelect}
                        options={this.state.listSelectPaint}
                        name="selectedPaint"
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
                    className="btn btn-primary btn-save-information"
                    onClick={() => this.handleSaveDetail()}
                >
                    Lưu
                </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(InformationPaint);
