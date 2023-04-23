import React, { Component } from "react";
import { connect } from "react-redux";
import { postVerifyOrder } from '../../services/userService';
import './VerifyAccount.scss';

class VerifyOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0,
        }
    }
    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let transactionId = urlParams.get('transactionId');
            let userId = urlParams.get('userId');
            let res = await postVerifyOrder({
                transactionId: transactionId,
                userId: userId
            })
            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    render() {
        let { statusVerify, errCode } = this.state;
        return (
            <>
                <div className="verify-email-container">
                    {statusVerify === false ?
                        <div>
                            Loading data.....
                        </div>
                        :
                        <div>
                            {+errCode === 0 ?
                                <div className="verify-account">Đặt Hàng Thành Công!</div> :
                                <div className="verify-account">Liên kết đã được xác nhận, vui lòng không nhấn thêm!</div>
                            }
                        </div>
                    }
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyOrder);
