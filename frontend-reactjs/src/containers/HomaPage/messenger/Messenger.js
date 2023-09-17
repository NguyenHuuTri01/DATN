import React, { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import './Messenger.scss';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { io } from 'socket.io-client';
import { sendMessage, getMessage, seenMessage } from '../../../services/userService';
import CircularProgress from '@mui/material/CircularProgress';

let DisplayMessage = lazy(() => import("./DisplayMessage"));

class Messenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            userId: 0,
            rows: 1,
            maxRows: 3,
            listMessage: []
        };
        this.socket = React.createRef();
        this.scrollRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    async componentDidMount() {
        this.socket.current = io('http://localhost:8800')
        if (this.props.userInfo && this.props.userInfo.id) {
            let getmessage = await getMessage({
                senderId: this.props.userInfo.id,
                receiverId: 21
            })
            if (getmessage && getmessage.errCode === 0) {
                this.setState({
                    userId: this.props.userInfo.id,
                    listMessage: getmessage.data
                })
            }

            this.socket.current.emit("new-user-add", this.props.userInfo.id)
            this.socket.current.on("get-users", users => {
                // console.log(users)
            })
            this.socket.current.on("receive-message", async (data) => {
                this.addMessage(data.senderId, data.receiverId, data.message, new Date())
                if (!this.props.isExpanded) {
                    await seenMessage({
                        receiverId: this.props.userInfo.id,
                        senderId: 21
                    })
                }
                this.props.getDataNotSeen()
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isExpanded !== this.props.isExpanded) {
            if (!this.props.isExpanded) {
                await seenMessage({
                    receiverId: this.props.userInfo.id,
                    senderId: 21
                })
                this.props.getDataNotSeen()
            }
        }
        if (prevProps.userInfo !== this.props.userInfo) {
            let getmessage = await getMessage({
                senderId: this.props.userInfo.id,
                receiverId: 21
            })
            if (getmessage && getmessage.errCode === 0) {
                this.setState({
                    userId: this.props.userInfo.id,
                    listMessage: getmessage.data
                })
            }
            if (this.socket.current) {
                this.socket.current.emit("new-user-add", this.props.userInfo.id)
                this.socket.current.on("get-users", users => {
                    // console.log(users)
                })
                this.socket.current.on("receive-message", async (data) => {
                    this.addMessage(data.senderId, data.receiverId, data.message, new Date())
                    if (!this.props.isExpanded) {
                        await seenMessage({
                            receiverId: this.props.userInfo.id,
                            senderId: 21
                        })
                    }
                    this.props.getDataNotSeen()
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
                receiverId: 21,
                message: this.state.value,
            }
        )
        this.addMessage(this.state.userId, 21, this.state.value, new Date())
        await sendMessage({
            senderId: this.state.userId,
            receiverId: 21,
            message: this.state.value,
        })
        this.setState({
            rows: 1
        })
    }
    addMessage = (sender, receiver, message, time) => {
        if (message) {
            let list = this.state.listMessage;
            list.push({
                senderId: sender,
                receiverId: receiver,
                message: message,
                createdAt: time,
            });
            this.setState({
                listMessage: list,
                value: ''
            })
        }
    }
    render() {
        let { isExpanded } = this.props
        let { rows, maxRows, value, listMessage } = this.state;
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
                        <h2>Tư vấn trực tuyến</h2>
                    </div>
                    <div className="messenger-chat-body">
                        {
                            listMessage && listMessage.length > 0 &&
                            listMessage.map((item, index) => (
                                <div
                                    key={index}
                                    ref={this.scrollRef}
                                >
                                    <Suspense fallback={<CircularProgress />}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
