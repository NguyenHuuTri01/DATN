import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllPaintProduct } from '../../../services/userService';
import ReactPaginate from 'react-paginate';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import './NumberOfItemSold.scss';

class NumberOfItemSold extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allProduct: [], // Dữ liệu bảng
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
            sortUp: true
        };
    }
    async componentDidMount() {
        let res = await getAllPaintProduct();
        if (res && res.errCode === 0) {

            this.setState({
                allProduct: res.data.sort((a, b) => a.numberSold - b.numberSold)
            })
        }

    }
    sortUp = () => {
        let coppyState = [...this.state.allProduct]
        coppyState.sort((a, b) => a.numberSold - b.numberSold);
        this.setState({
            sortUp: true,
            allProduct: [...coppyState]
        })
    }
    sortDown = () => {
        let coppyState = [...this.state.allProduct]
        coppyState.sort((a, b) => b.numberSold - a.numberSold);
        this.setState({
            sortUp: false,
            allProduct: [...coppyState]
        })
    }
    handlePageClick = ({ selected }) => {
        this.setState({
            currentPage: selected
        });
    };

    render() {
        let { currentPage, perPage, allProduct, sortUp } = this.state;
        let offset = currentPage * perPage;
        let pageCount = Math.ceil(allProduct.length / perPage);
        let currentPageData = allProduct.slice(offset, offset + perPage);

        return (
            <div className="number-sold-container">
                <div className="number-sold-title">
                    Số Lượng Sơn Đã Bán Được
                </div>
                <div className="table-danhmuchang">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã Sản Phẩm</th>
                                <th>Tên Sản Phẩm</th>
                                <th style={{ width: '300px' }}>
                                    Số Lượng Bán Được
                                    {
                                        sortUp ?
                                            <span onClick={() => this.sortDown()}>
                                                <ArrowUpwardIcon className="sort" />
                                            </span> :
                                            <span onClick={() => this.sortUp()}>
                                                <ArrowDownwardIcon className="sort" />
                                            </span>
                                    }
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ width: 200 }}>{item.paintId}</td>
                                    <td>{item.paintName}</td>
                                    <td>{item.numberSold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(NumberOfItemSold);
