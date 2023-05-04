import React, { Component } from "react";
import { connect } from "react-redux";
import { getInformationById } from '../../../services/userService';
import './Detail.scss';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHTML: '',
            contentMarkdown: '',
            data: []
        }
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

    render() {
        let { data } = this.state;
        return (
            <div className="detail-paint-container">
                <div className="header-paint">
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
