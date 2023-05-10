import React, { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import './Messenger.scss';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { io } from 'socket.io-client';
import Avatar from '@mui/material/Avatar';
import { getAllUsers } from '../../../services/userService';

let DisplayMessage = lazy(() => import("./DisplayMessage"));

class MessengerWithManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            userId: 0,
            rows: 1,
            maxRows: 3,
            listMessage: [],
            listUser: [],
            receiverId: 0,
        };
        this.socket = React.createRef();
        this.scrollRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    async componentDidMount() {
        let listUserMessage = await getAllUsers();
        if (listUserMessage.errCode === 0) {
            this.setState({
                listUser: listUserMessage.users,
                unreadMessages: ''
            })
        }

        this.socket.current = io('http://localhost:8800')
        if (this.props.userInfo && this.props.userInfo.id) {
            this.setState({
                userId: this.props.userInfo.id
            })

            this.socket.current.emit("new-user-add", this.props.userInfo.id)
            this.socket.current.on("get-users", users => {
                console.log(users)
            })
            this.socket.current.on("receive-message", (data) => {
                console.log(data.message)
                this.addMessage(data.senderId, data.receiverId, data.message)
                this.setState({ unreadMessages: this.state.unreadMessages + 1 });
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.setState({
                userId: this.props.userInfo.id
            })
            if (this.socket.current) {
                this.socket.current.emit("new-user-add", this.props.userInfo.id)
                this.socket.current.on("get-users", users => {
                    console.log(users)
                })
                this.socket.current.on("receive-message", (data) => {
                    console.log(data)
                    this.addMessage(data.senderId, data.receiverId, data.message)
                    this.setState({ unreadMessages: this.state.unreadMessages + 1 });
                })
            }
        }
        if (this.scrollRef.current) {
            this.scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }
    handleKeyDown(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.sendMesage()
        }
    }
    handleChange(event) {
        this.setState({
            value: event.target.value,
            rows: event.target.value.length / 38 + 1
        });
    }
    sendMesage = () => {
        this.socket.current.emit("send-message",
            {
                senderId: this.state.userId,
                receiverId: this.state.receiverId,
                message: this.state.value
            }
        )
        // this.state.socket.emit('chatMessage', {
        //     sender: this.state.userId,
        //     receiver: 21,
        //     message: this.state.value
        // });
        this.addMessage(this.state.userId, this.state.receiverId, this.state.value)
    }
    addMessage = (sender, receiver, message) => {
        if (message) {
            let list = this.state.listMessage;
            list.push({
                sender: sender,
                receiver: receiver,
                message: message
            });
            this.setState({
                listMessage: list,
                value: ''
            })
        }
    }
    chooseUserreceiverId = (receiver) => {
        this.setState({
            receiverId: receiver
        })
    }
    render() {
        let { isExpanded } = this.props
        let { rows, maxRows, value, listMessage, listUser, receiverId } = this.state;
        console.log("check chua doc:", this.state.unreadMessages)
        return (
            <div className={isExpanded ? 'messenger-container-expanded' : 'messenger-container'}>
                <button
                    className="messenger-toggle"
                    onClick={() => this.props.handleCloserMessenger()}
                >
                    <CloseIcon />
                </button>
                <div className="messenger-chat">
                    <div className="messenger-chat-header">
                        <h2>Tư vấn trực tuyến quản lý</h2>
                    </div>
                    <div className="messenger-chat-body">
                        {
                            listMessage && listMessage.length > 0 &&
                            listMessage.map((item, index) => (
                                <div
                                    key={index}
                                    ref={this.scrollRef}
                                >
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <DisplayMessage
                                            data={item}
                                            userId={this.state.userId}
                                        />
                                    </Suspense>
                                </div>
                            ))
                        }
                    </div>
                    <div className="messenger-chat-action">
                        <textarea
                            className="input-chat"
                            placeholder="Type a message..."
                            value={value}
                            rows={rows <= maxRows ? rows : maxRows}
                            onChange={this.handleChange}
                            onKeyDown={(e) => this.handleKeyDown(e)}
                        />
                        <SendIcon className="btn-send"
                            onClick={() => this.sendMesage()}
                        />
                    </div>
                    <div className="list-user">
                        <input className="form-control" placeholder="Tìm kiếm người dùng" />
                        {
                            listUser && listUser.length > 0 &&
                            listUser.map((item, index) => (
                                <div
                                    className={receiverId === item.id ?
                                        "user-item active" :
                                        "user-item"}
                                    key={index}
                                    onClick={() => this.chooseUserreceiverId(item.id)}
                                >
                                    <Avatar></Avatar>
                                    <label>
                                        {item.email}
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MessengerWithManage);
