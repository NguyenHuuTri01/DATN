import React, { Component } from "react";
import { connect } from "react-redux";

class ListCancelOrder extends Component {
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
                ListCancelOrder
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

export default connect(mapStateToProps, mapDispatchToProps)(ListCancelOrder);
