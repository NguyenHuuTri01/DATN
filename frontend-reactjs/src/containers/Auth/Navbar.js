import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import './Navbar.scss';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="navbar">
                <div className="links">
                    <NavLink to="/login" activeClassName="active-link">Đăng Nhập</NavLink>
                    <NavLink to="/register" activeClassName="active-link">Đăng Ký</NavLink>
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
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
