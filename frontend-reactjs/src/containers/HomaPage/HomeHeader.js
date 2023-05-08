import React, { Component } from "react";
import './HomeHeader.scss';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from "../../store/actions";
import { addToCart, getAllCartById, delelteCart } from '../../services/userService';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Shoping from "./products/Shoping";
import Machining from "./machining/Machining";
import ModalStore from "./modals/ModalStore";
import ListMachining from "./machining/ListMachining";
import Description from "./Description";

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { deepOrange } from '@mui/material/colors';

class HomeHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '2',
      store: [],
      isOpenModal: false,
      openUserMenu: null
    }
  }
  async componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.id) {
      this.getDataStore();
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.userInfo !== this.props.userInfo) {
      this.getDataStore();
    }
  }
  getDataStore = async () => {
    if (this.props.isLoggedIn) {
      let resData = await getAllCartById(this.props.userInfo.id);
      this.setState({
        store: [...resData.data]
      })
    }
  }

  handleChange = (value) => {
    this.setState({
      value: value
    })
  }

  handleAddToCart = async (item) => {
    for (let i = 0; i < this.state.store.length; i++) {
      if (this.state.store[i].id === item.id) {
        return
      }
    }
    let resAddCart = await addToCart({
      userId: this.props.userInfo.id,
      paintId: item.paintId
    })
    if (resAddCart && resAddCart.errCode === 0) {
      this.getDataStore()
    }
  }

  handleOpenModal = () => {
    this.setState({
      isOpenModal: true
    })
  }

  handleCloseModal = () => {
    this.getDataStore()
    this.setState({
      isOpenModal: false
    })
  }

  popItemArray = (list, item) => {
    let removeIndex = list.findIndex((itemList) => itemList.id === item.id);
    list.splice(removeIndex, 1)
    return list;
  }

  handlePayPainBucket = async (data, totalMoney) => {
    let copyStore = this.state.store;
    data.forEach(async (item, index) => {
      this.popItemArray(copyStore, item)
      await delelteCart({
        userId: item.userId,
        paintId: item.paintId,
      });
    })
    await this.getDataStore();
    // this.setState({
    //   store: [...copyStore]
    // })
  }
  handleLogin = () => {
    if (this.props.history) {
      this.props.history.push(`/login`);
    }
  }
  handleLogOut = () => {
    this.props.processLogout();
    if (this.props.history) {
      this.props.history.push(`/login`);
    }
  }
  handleOpenUserMenu = (e) => {
    this.setState({
      openUserMenu: e.currentTarget
    })
  }
  handleCloseUserMenu = () => {
    this.setState({
      openUserMenu: null
    })
  }
  handleAccountManagement = (userId) => {
    if (this.props.history) {
      this.props.history.push(`/account-management`);
    }
  }
  handlePaintManagement = () => {
    window.open("http://localhost:3000/system/manage-paint", "_blank");
  }
  handleManageUser = () => {
    window.open("http://localhost:3000/system/manage-user", "_blank");
  }
  render() {
    let { value, store, openUserMenu } = this.state;
    let { userInfo } = this.props;
    return (
      <>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value} >
            <Box sx={{
              borderBottom: 2, borderColor: 'divider', display: 'flex',
              justifyContent: 'center', background: '#D6E4E5'
            }}>
              <div className="left-header">Logo</div>
              <TabList
                aria-label="lab API tabs example"
                centered={true}
                className="tab-list"
              >
                <Tab label="Giới thiệu" value="1" onClick={() => this.handleChange('1')} />
                <Tab label="Các sản phẩm" value="2" onClick={() => this.handleChange('2')} />
                <Tab label="Thuê Gia Công" value="3" onClick={() => this.handleChange('3')} />
              </TabList>
              <div className="right-header">
                <Badge badgeContent={store && store.length} color="primary">
                  <ShoppingCartIcon
                    style={{ cursor: "pointer" }}
                    color="action"
                    fontSize="large"
                    onClick={() => this.handleOpenModal()}
                    className="icon-store"
                  />
                </Badge>
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={(e) => this.handleOpenUserMenu(e)} sx={{ p: 0 }}>
                      <Avatar
                        sx={{ bgcolor: userInfo ? deepOrange[500] : "" }}
                      ></Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '40px' }}
                    id="menu-appbar"
                    anchorEl={openUserMenu}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(openUserMenu)}
                    onClose={() => this.handleCloseUserMenu()}
                  >
                    {
                      !userInfo ?
                        <MenuItem onClick={() => this.handleCloseUserMenu()}>
                          <Typography
                            textAlign="center"
                            onClick={() => this.handleLogin()}
                          >Đăng Nhập</Typography>
                        </MenuItem>
                        :
                        <div>
                          <MenuItem onClick={() => this.handleCloseUserMenu()}>
                            <Typography
                              textAlign="center"
                              onClick={() => this.handleAccountManagement(userInfo.id)}
                            >Xem Thêm</Typography>
                          </MenuItem>
                          {
                            this.props.userInfo &&
                            (this.props.userInfo.roleId === 'R3')
                            &&
                            <MenuItem onClick={() => this.handleCloseUserMenu()}>
                              <Typography
                                textAlign="center"
                                onClick={() => this.handlePaintManagement()}
                              >Quản Lý Sản Phẩm</Typography>
                            </MenuItem>
                          }
                          {
                            this.props.userInfo &&
                            (this.props.userInfo.roleId === 'R1')
                            &&
                            <MenuItem onClick={() => this.handleCloseUserMenu()}>
                              <Typography
                                textAlign="center"
                                onClick={() => this.handleManageUser()}
                              >Quản Lý Người Dùng</Typography>
                            </MenuItem>
                          }
                          <MenuItem onClick={() => this.handleCloseUserMenu()}>
                            <Typography
                              textAlign="center"
                              onClick={() => this.handleLogOut()}
                            >Đăng Xuất</Typography>
                          </MenuItem>
                        </div>
                    }
                  </Menu>
                </Stack>
              </div>
            </Box>
            <TabPanel value="1">
              <Description />
            </TabPanel>
            <TabPanel value="2">
              <Shoping
                addToCart={store}
                handleAddToCart={this.handleAddToCart}
              />
            </TabPanel>
            <TabPanel value="3">
              {this.props.userInfo && this.props.userInfo.roleId === 'R4' ?
                <ListMachining /> :
                <Machining />
              }
            </TabPanel>
          </TabContext>
        </Box>

        <ModalStore
          isOpenModal={this.state.isOpenModal}
          handleCloseModal={this.handleCloseModal}
          store={this.state.store}
          handlePayPainBucket={this.handlePayPainBucket}
          getDataStore={this.getDataStore}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
