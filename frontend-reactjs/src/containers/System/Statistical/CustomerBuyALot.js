import React, { Component } from "react";
import { connect } from "react-redux";

class CustomerBuyALot extends Component {
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
                Hello word
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerBuyALot);
