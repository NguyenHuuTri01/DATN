import React, { Component } from "react";
import { connect } from "react-redux";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Information from "./Information";
import ChangePassword from "./ChangePassword";

class AccountManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "1",
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
        let { value } = this.state;

        return (
            <>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>

                            <TabList
                                aria-label="lab API tabs example"
                                centered={true}
                                className="tab-list"
                            >
                                <Tab label="Quản lý thông tin" value="1" onClick={() => this.handleChange('1')} />
                                <Tab label="Đổi mật khẩu" value="2" onClick={() => this.handleChange('2')} />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Information />
                        </TabPanel>
                        <TabPanel value="2">
                            <ChangePassword />
                        </TabPanel>
                    </TabContext>
                </Box>
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagement);
