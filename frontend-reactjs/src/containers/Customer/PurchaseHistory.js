import React, { Component } from "react";
import { connect } from "react-redux";
import './PurchaseHistory.scss';

class PurchaseHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {

        return (
            <>
                PurchaseHistory
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseHistory);
