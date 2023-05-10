import React, { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import './Messenger.scss';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { io } from 'socket.io-client';
import Avatar from '@mui/material/Avatar';
import { getAllMessage, sendMessage, getMessage } from '../../../services/userService';
import { deepOrange } from '@mui/material/colors';

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
            newMessage: {}
        };
        this.socket = React.createRef();
        this.scrollRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    async componentDidMount() {
        this.getUserMessage();
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
                if (this.state.receiverId === data.receiverId) {
                    this.addMessage(data.senderId, data.receiverId, data.message, new Date())
                }
                this.getUserMessage()
            })
        }
    }
    getUserMessage = async () => {
        let listUserMessage = await getAllMessage({
            receiverId: 21
        });
        if (listUserMessage.errCode === 0) {
            this.setState({
                listUser: listUserMessage.dataMessage,
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
                    this.addMessage(data.senderId, data.receiverId, data.message, new Date())
                    this.getUserMessage()
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
    sendMesage = async () => {
        this.socket.current.emit("send-message",
            {
                senderId: this.state.userId,
                receiverId: this.state.receiverId,
                message: this.state.value
            }
        )
        this.addMessage(this.state.userId, this.state.receiverId, this.state.value)
        await sendMessage({
            senderId: this.state.userId,
            receiverId: this.state.receiverId,
            message: this.state.value,
        })
        this.getUserMessage();
    }
    addMessage = (sender, receiver, message, time) => {
        if (message) {
            let list = this.state.listMessage;
            list.push({
                senderId: sender,
                receiverId: receiver,
                message: message
            });
            this.setState({
                listMessage: list,
                value: ''
            })
        }
    }
    chooseUserreceiverId = async (receiver) => {
        let getmessenger = await getMessage({
            senderId: this.state.userId,
            receiverId: receiver
        });
        if (getmessenger && getmessenger.errCode === 0) {
            this.setState({
                receiverId: receiver,
                listMessage: getmessenger.data
            })
        }
    }
    render() {
        let { isExpanded } = this.props
        let { rows, maxRows, value, listMessage, listUser, receiverId, newMessage, userId }
            = this.state;
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
                                    className={
                                        receiverId === (item.senderId === userId ?
                                            item.receiverId : item.senderId)
                                            ?
                                            "user-item active" :
                                            "user-item"}
                                    key={index}
                                    onClick={() => this.chooseUserreceiverId(
                                        item.senderId === userId ?
                                            item.receiverId : item.senderId
                                    )}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: receiverId === (item.senderId === userId ?
                                                item.receiverId :
                                                item.senderId)
                                                ? deepOrange[500] : ""
                                        }}
                                    ></Avatar>
                                    <div>
                                        <div className="email">
                                            {item.emailReceiver && item.emailReceiver.email}
                                            {item.emailSender && item.emailSender.email}
                                        </div>
                                        <div className="new-message">
                                            {
                                                newMessage.senderId === item.senderId ?
                                                    newMessage.message :
                                                    item.message
                                            }
                                        </div>
                                    </div>
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
