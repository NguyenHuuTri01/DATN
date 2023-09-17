import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageUser.scss";
import Select from 'react-select';
import { toast } from "react-toastify";
import {
    getAllUsers, createNewUserByAdmin, editUserByAdmin, deleteUserService
} from '../../../services/userService';
import ReactPaginate from 'react-paginate';
import unorm from 'unorm';

const listRole = [{
    name: 'Admin',
    roleId: 'R1'
},
{
    name: 'Khách Hàng',
    roleId: 'R2'
},
{
    name: 'Nhân Viên Quản Lý',
    roleId: 'R3'
},
{
    name: 'Chủ Thầu',
    roleId: 'R4'
}
]
class ManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            address: '',
            phonenumber: '',
            password: '',
            roleList: [],
            selectedRole: '',
            action: 'CREATE',
            userId: '',
            allUsers: [], // Dữ liệu bảng
            currentPage: 0, // Số trang hiện tại
            perPage: 10, // Số phần tử trên một trang
            disableEmail: false,
        };
    }

    async componentDidMount() {
        this.setState({
            roleList: this.buildDataInputSelect(listRole)
        })
        this.getListUsers();
    }

    getListUsers = async () => {
        let data = await getAllUsers();
        if (data && data.errCode === 0) {
            this.setState({
                allUsers: [...data.users]
            })
        }
    }
    onChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state }
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }
    buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.name;
                object.value = item.roleId;
                result.push(object);
                return result;
            })
        }
        return result;
    }
    handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        })
    }

    validateEmail = (email) => {
        const normalizedStr = unorm.nfkd(email);
        const regex = /[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF\u1EF0-\u1EFF]/;
        if (regex.test(normalizedStr)) {
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    validatePhoneNumber = (phoneNumber) => {
        const phoneNumberRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        return phoneNumberRegex.test(phoneNumber);
    }
    handleCreateNewUser = async () => {
        let {
            email, name, address, phonenumber, password, selectedRole, action, userId
        } = this.state;
        if (!email || !selectedRole || !password) {
            alert('Vui Lòng Nhập Đầy Đủ Thông Tin')
            return
        }
        if (!this.validateEmail(email)) {
            alert("Email Không Chính Xác!")
            return
        }
        if (phonenumber !== '') {
            if (!this.validatePhoneNumber(phonenumber)) {
                alert("Số Điện Thoại Không Tồn Tại!")
                return
            }
        }
        if (action === 'CREATE') {
            let resCreateUser = await createNewUserByAdmin({
                email: email,
                name: name,
                address: address,
                phonenumber: phonenumber,
                password: password,
                roleId: selectedRole.value,
            })

            if (resCreateUser && resCreateUser.errCode === 1) {
                toast.error('Tài Khoản Đã Tồn Tại!');
            } else
                if (resCreateUser && resCreateUser.errCode === 0) {
                    this.getListUsers();
                    toast.success('Tạo Tài Khoản Thành Công!');
                    this.setState({
                        email: '',
                        name: '',
                        address: '',
                        phonenumber: '',
                        password: '',
                        selectedRole: '',
                    })
                }
        } else {
            let resUpdatePaint = await editUserByAdmin({
                email: email,
                name: name,
                address: address,
                phonenumber: phonenumber,
                password: password,
                roleId: selectedRole.value,
                id: userId,
            })
            if (resUpdatePaint && resUpdatePaint.errCode === 0) {
                this.getListUsers();
                toast.success('Cập Nhật Sản Phẩm Thành Công!');
                this.setState({
                    email: '',
                    name: '',
                    address: '',
                    phonenumber: '',
                    password: '',
                    selectedRole: '',
                    action: 'CREATE',
                    userId: ''
                })
            }
        }
    }
    handleUpdate = (itemData) => {
        let { roleList } = this.state;
        let roleId = itemData.roleId;
        let selectedRole = roleList.find(item => {
            return item && item.value === roleId
        })
        this.setState({
            email: itemData.email,
            name: itemData.name !== null ? itemData.name : '',
            address: itemData.address !== null ? itemData.address : '',
            phonenumber: itemData.phonenumber !== null ? itemData.phonenumber : '',
            selectedRole: selectedRole,
            action: 'EDIT',
            password: 'password',
            userId: itemData.id,
        })
    }

    handleCancelChangeUser = () => {
        this.setState({
            email: '',
            name: '',
            password: '',
            phonenumber: '',
            address: '',
            selectedRole: '',
            action: 'CREATE',
        })
    }

    handleDelete = async (userId) => {
        if (window.confirm('Bạn muốn xóa tài khoản này này?')) {
            let resDelete = await deleteUserService(userId);
            if (resDelete && resDelete.errCode === 0) {
                this.getListUsers();
                toast.success("Xóa Thành Công!")
            }
        } else {
            // xử lý khi chọn No
        }
    }
    handlePageClick = ({ selected }) => {
        this.setState({
            currentPage: selected
        });
    };
    render() {
        let { email, name, address, phonenumber, roleList,
            selectedRole, action, currentPage, perPage, allUsers, password }
            = this.state;
        let offset = currentPage * perPage;
        let pageCount = Math.ceil(allUsers.length / perPage);
        let currentPageData = allUsers.slice(offset, offset + perPage);
        return (
            <div className="paint-container">
                <div className="title-qlsp">Quản Lý Tài Khoản</div>
                <div className="form-group">
                    <div className="col-4">
                        <label>Email:</label>
                        <div>
                            <input
                                className="form-control"
                                value={email}
                                onChange={(e) => this.onChangeInput(e, "email")}
                                disabled={action === 'EDIT' ? true : false}
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <label>Password:</label>
                        <div>
                            <input
                                className="form-control"
                                value={password}
                                onChange={(e) => this.onChangeInput(e, "password")}
                                disabled={action === 'EDIT' ? true : false}
                                type="password"
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <label>Name:</label>
                        <div>
                            <input
                                className="form-control"
                                value={name}
                                min={0}
                                type="text"
                                onChange={(e) => this.onChangeInput(e, "name")}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-4">
                        <label>Address: </label>
                        <div>
                            <input
                                className="form-control"
                                type="text"
                                value={address}
                                onChange={(e) => this.onChangeInput(e, "address")}
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <label>Phonenumber:</label>
                        <div>
                            <input
                                className="form-control"
                                value={phonenumber}
                                type="number"
                                onChange={(e) => this.onChangeInput(e, "phonenumber")}
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <label>Role:</label>
                        <div>
                            <Select
                                value={selectedRole}
                                onChange={this.handleChangeSelect}
                                options={roleList}
                                name="selectedRole"
                            />
                        </div>
                    </div>
                </div>
                <div className="btn-create-product">
                    {
                        action === "CREATE" ?
                            <button
                                className="btn btn-primary"
                                onClick={() => this.handleCreateNewUser()}
                            >Tạo</button>
                            :
                            <>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => this.handleCreateNewUser()}
                                >Lưu</button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => this.handleCancelChangeUser()}
                                >Hủy</button>
                            </>
                    }
                </div>

                <div className="table-danhmuchang">
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ width: 200 }}>{item.email}</td>
                                    <td>{item.name}</td>
                                    <td className="action-btn">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => this.handleDelete(item.id)}
                                        >Delete</button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => this.handleUpdate(item)}
                                        >Update</button>
                                    </td>
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
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageUser);
