import React, { Component } from "react";
import { connect } from "react-redux";

class ListOrderPaypal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    async componentDidMount() {
    }


    render() {
        return (
            <div>
                List Order Paypal
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

export default connect(mapStateToProps, mapDispatchToProps)(ListOrderPaypal);
