import React, { Component } from "react";
import { connect } from "react-redux";

class ListOrderCash extends Component {
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
                ListOrderCash
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

export default connect(mapStateToProps, mapDispatchToProps)(ListOrderCash);
