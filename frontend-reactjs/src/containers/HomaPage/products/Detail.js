import React, { Component } from "react";
import { connect } from "react-redux";
import { getInformationById, addToCart } from '../../../services/userService';
import './Detail.scss';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import { createBrowserHistory } from 'history';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHTML: '',
            contentMarkdown: '',
            data: []
        }
        this.history = createBrowserHistory();
    }
    async componentDidMount() {

        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getInformationById(id);
            if (res && res.errCode === 0) {
                this.setState({
                    contentHTML: res.findPaint.contentHTML,
                    contentMarkdown: res.findPaint.contentMarkdown,
                    data: res.findPaint
                })
            }
        }

    }
    backToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    }
    handleAddToCart = async () => {
        if (this.props.isLoggedIn) {
            let resAddCart = await addToCart({
                userId: this.props.userInfo.id,
                paintId: this.state.data.paintId
            })
            if (resAddCart && resAddCart.errCode === 0) {
                alert("Thêm thành công vào giỏ hàng");
            } else {
                alert("Sản phẩm đã tồn tại trong giỏ hàng");
            }
        } else {
            alert("Đăng nhập để mua hàng");
        }
    }

    render() {
        let { data } = this.state;
        return (
            <div className="detail-paint-container">
                <div className="header-paint">
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value="">
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
                                </TabList>
                            </Box>
                        </TabContext>
                    </Box>
                </div>
                <div className="information-paint">
                    <div className="name-paint">
                        {data.detailProduct && data.detailProduct.paintName}
                    </div>
                    <div
                        className="image-paint"
                        style={{
                            backgroundImage: `url(${data.detailProduct && data.detailProduct.image})`
                        }}
                    ></div>
                    <div className="btn-add-to-cart">
                        <button
                            className="btn-add"
                            onClick={() => this.handleAddToCart()}
                        >Thêm vào giỏ hàng</button>
                    </div>
                    <div className="detail-paint">
                        {
                            <div dangerouslySetInnerHTML={{ __html: data.contentHTML }}>
                            </div>
                        }
                    </div>
                    <div style={{ height: '10px' }}></div>
                </div>
            </div>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
