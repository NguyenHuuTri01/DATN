import React, { Component } from "react";
import { connect } from "react-redux";

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }
    handleChange = (value) => {
        this.setState({
            value: value
        })
    }

    render() {

        return (
            <>
                ChangePassword
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
