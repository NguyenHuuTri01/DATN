import React, { Component } from "react";
import { connect } from "react-redux";
import { getInformationById } from '../../../services/userService';
import './Detail.scss';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHTML: '',
            contentMarkdown: '',
            data: []
        }
    }
    async componentDidMount() {

        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getInformationById(id);
            if (res && res.errCode === 0) {
                this.setState({
                    contentHTML: res.findPaint.contentHTML,
                    contentMarkdown: res.findPaint.contentMarkdown,
                    data: res.findPaint
                })
            }
        }

    }

    render() {
        let { data } = this.state;
        return (
            <div className="detail-paint-container">
                <div className="name-paint">
                    {data.detailProduct && data.detailProduct.paintName}
                </div>
                <div
                    className="image-paint"
                    style={{
                        backgroundImage: `url(${data.detailProduct && data.detailProduct.image})`
                    }}
                ></div>
                <div className="detail-paint">
                    {
                        <div dangerouslySetInnerHTML={{ __html: data.contentHTML }}>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
