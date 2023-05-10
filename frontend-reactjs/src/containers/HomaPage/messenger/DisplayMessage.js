import React, { Component } from "react";
import { connect } from "react-redux";

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
        console.log(data.sender, data.receiver)
        console.log(this.props.userId)
        return (
            <div
                className={data.sender === this.props.userId ? "message-sent" : "message-received"}
            >
                <div>
                    {data.message}
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
