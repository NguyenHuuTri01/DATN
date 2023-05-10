import React, { Component } from "react";
import { connect } from "react-redux";
import './Description.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PlaceIcon from '@mui/icons-material/Place';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EmailIcon from '@mui/icons-material/Email';
import { getTopPaintProduct } from '../../services/userService';
import { withRouter } from 'react-router';

let handleAfterChange = () => { };
let settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    afterChange: handleAfterChange(),
};
class Description extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTopPaint: []
        }
    }

    async componentDidMount() {
        let getTopPaint = await getTopPaintProduct();
        if (getTopPaint && getTopPaint.errCode === 0) {
            this.setState({
                listTopPaint: getTopPaint.data ? getTopPaint.data : []
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleSeeDetail = (itemData) => {
        if (this.props.history) {
            this.props.history.push(`/detail/${itemData}`);
        }
    }

    render() {
        let { listTopPaint } = this.state;
        return (
            <div className="description-container">
                <div className="image-description">
                    <div className="tittle">
                        GIỚI THIỆU
                    </div>
                </div>
                <div className="letter">
                    <div className="title-letter">Thư ngỏ</div>
                    <div className="content-letter">
                        <p>
                            Kính gửi Quý khách hàng,
                        </p>
                        <p>
                            Công ty Sơn 51 xin trân trọng gửi đến Quý khách hàng lời chào
                            trân trọng nhất cùng sự cảm ơn chân thành về sự quan tâm,
                            ủng hộ và tin tưởng của Quý khách hàng đối với sản phẩm và dịch vụ
                            của chúng tôi trong suốt thời gian qua.
                        </p>
                        <p>
                            Với kinh nghiệm hơn 10 năm hoạt động trong lĩnh vực sản xuất và
                            phân phối sơn, chúng tôi tự hào là một trong những công ty hàng
                            đầu trong ngành công nghiệp sơn tại Việt Nam. Chúng tôi cam kết
                            mang đến cho Quý khách hàng những sản phẩm chất lượng cao,
                            đa dạng về mẫu mã và chủng loại, đồng thời hỗ trợ tư vấn và giải
                            đáp các thắc mắc liên quan đến sơn.
                        </p>
                        <p>
                            Chúng tôi rất mong được sự hợp tác và ủng hộ
                            của Quý khách hàng trong tương lai, để cùng nhau phát triển và
                            đạt được mục tiêu kinh doanh thành công.
                        </p>
                        <p>
                            Trân trọng,
                        </p>
                        <p>
                            Công ty Sơn 51.
                        </p>
                    </div>
                </div>
                <div className="slider">
                    <div className="slider-title">
                        Các sản phẩm bán chạy trong thời gian gần đây
                    </div>
                    <Slider {...settings}>
                        {listTopPaint && listTopPaint.length > 0 &&
                            listTopPaint.map((item, index) => {
                                return (
                                    <div
                                        className="slider-item"
                                        key={index}
                                        onClick={() => this.handleSeeDetail(item.paintId)}
                                    >
                                        <div>
                                            <div
                                                className="item-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                            </div>
                                            <div className="item-name-paint">
                                                {item.paintName}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </Slider>
                </div>
                <div className="footer">
                    <div className="address">
                        <PlaceIcon />
                        <label>Khu công nghiệp A, Quận B, Thành Phố C</label>
                    </div>
                    <div className="sdt">
                        <ContactPhoneIcon />
                        <label>84 xxxx xxx xxx</label>
                    </div>
                    <div className="email">
                        <EmailIcon />
                        <label>contact@51paint.com.vn</label>
                    </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Description));
