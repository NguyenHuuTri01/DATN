import React, { Component } from "react";
import { connect } from "react-redux";
import { format } from "timeago.js"

class DisplayMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
    }
    render() {
        let { data } = this.props;
        return (
            <div
                className={data.senderId === this.props.userId ? "message-sent" : "message-received"}
            >
                <div className="message-content">
                    <div>
                        {data.message}
                    </div>
                    <div className="time">
                        {format(data.createdAt)}
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DisplayMessage);
