import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import './PaintPack.scss';
import { createPaintPack } from '../../services/userService'

const mdParser = new MarkdownIt(/* Markdown-it options */);
class PaintPack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionHTML: '',
            descriptionMarkdown: '',
            name: '',
        };
    }
    async componentDidMount() {

    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }


    handleSavePaintPack = async () => {
        // if (this.state.action === 'CREATE') {
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
            toast.success("Tạo Thành Công");
        }
        // } else {
        //     let create = await updateInformationPaint({
        //         name: this.state.selectedPaint.value,
        //         descriptionHTML: this.state.descriptionHTML,
        //         descriptionMarkdown: this.state.descriptionMarkdown
        //     })
        //     if (create && create.errCode === 0) {
        //         this.setState({
        //             selectedPaint: '',
        //             descriptionHTML: '',
        //             descriptionMarkdown: '',
        //             action: 'CREATE'
        //         })
        //         toast.success("Cập Nhật Thông Tin Thành Công");
        //     }
        // }
    }
    onChangeInput = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    render() {
        return (
            <div className="paint-pack-container">
                <div className="paint-pack-title">
                    Các Gói Gia Công
                </div>
                <div className="paint-pack-name">
                    <label>Tên Gói Thầu:</label>
                    <input
                        className="form-control md-4"
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

export default connect(mapStateToProps, mapDispatchToProps)(PaintPack);
