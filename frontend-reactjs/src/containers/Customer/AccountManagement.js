import React, { Component } from "react";
import { connect } from "react-redux";
import './AccountManagement.scss';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Information from "./Information";
import ChangePassword from "./ChangePassword";
import PurchaseHistory from "./PurchaseHistory";
import HomeIcon from '@mui/icons-material/Home';
import ListGiaCong from "./ListGiaCong";

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
    backToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    }
    render() {
        let { value } = this.state;
        return (
            <>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{
                            borderBottom: 1, borderColor: 'divider', display: 'flex',
                            justifyContent: 'center', background: '#D6E4E5'
                        }}>
                            <HomeIcon
                                className="icon-back-to-home"
                                onClick={() => this.backToHome()}
                            />
                            <TabList
                                aria-label="lab API tabs example"
                                centered={true}
                                className="tab-list"
                            >
                                <Tab label="Quản lý thông tin" value="1" onClick={() => this.handleChange('1')} />
                                <Tab label="Đổi mật khẩu" value="2" onClick={() => this.handleChange('2')} />
                                <Tab label="Lịch sử mua hàng" value="3" onClick={() => this.handleChange('3')} />
                                <Tab label="Danh sách thuê gia công"
                                    hidden={this.props.userInfo && this.props.userInfo.roleId === 'R4' ?
                                        false : true}
                                    value="4" onClick={() => this.handleChange('4')} />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Information />
                        </TabPanel>
                        <TabPanel value="2">
                            <ChangePassword />
                        </TabPanel>
                        <TabPanel value="3">
                            <PurchaseHistory />
                        </TabPanel>
                        <TabPanel value="4">
                            <ListGiaCong />
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
