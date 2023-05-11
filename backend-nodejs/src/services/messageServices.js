import db from "../models/index";
const { Op } = require("sequelize");

let sendMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.senderId || !data.receiverId || !data.message) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Message.create({
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    message: data.message,
                    status: 'notseen',
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.senderId || !data.receiverId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let res = await db.Message.findAll({
                    where: {
                        senderId: [data.senderId, data.receiverId],
                        receiverId: [data.senderId, data.receiverId],
                    },
                    raw: true
                })
                if (res) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Ok',
                        data: res
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.receiverId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let resUser = await db.User.findAll({
                    where: {
                        id: {
                            [Op.not]: data.receiverId
                        },
                    },
                    attributes: ["id", "email"],
                });
                let dataMessage = []
                if (resUser && resUser.length > 0) {
                    let lengResUser = resUser.length;
                    for (let i = 0; i < lengResUser; i++) {
                        let resgetmessage = await db.Message.findOne({
                            where: {
                                senderId: [resUser[i].id, data.receiverId],
                                receiverId: [resUser[i].id, data.receiverId]
                            },
                            order: [['createdAt', 'DESC']],
                            raw: true,
                        });

                        if (resgetmessage) {
                            if (resgetmessage.senderId !== +data.receiverId) {
                                // select -> resgetmessage.senderId
                                let res = await db.User.findOne({
                                    where: {
                                        id: resgetmessage.senderId
                                    },
                                    attributes: ['email'],
                                })
                                let messageNotseen = await db.Message.findAll({
                                    where: {
                                        senderId: resgetmessage.senderId,
                                        receiverId: data.receiverId,
                                        status: "notseen"
                                    }
                                });
                                resgetmessage.emailSender = res
                                resgetmessage.notSeen = messageNotseen.length
                            } else {
                                // select  resgetmessage.receiverId
                                let res = await db.User.findOne({
                                    where: {
                                        id: resgetmessage.receiverId
                                    },
                                    attributes: ['email'],
                                })
                                let messageNotseen = await db.Message.findAll({
                                    where: {
                                        senderId: resgetmessage.receiverId,
                                        receiverId: data.receiverId,
                                        status: "notseen"
                                    }
                                });
                                resgetmessage.emailReceiver = res
                                resgetmessage.notSeen = messageNotseen.length
                            }

                            dataMessage.push(resgetmessage)
                        }
                    }
                    dataMessage.sort(function (a, b) {
                        return b.createdAt - a.createdAt;
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    dataMessage
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let seenMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.receiverId || !data.senderId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Message.update({ status: "seen" }, {
                    where: {
                        receiverId: data.receiverId,
                        senderId: data.senderId,
                        status: "notseen"
                    }
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getNotSeenMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.receiverId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let res = await db.Message.findAll({
                    where: {
                        receiverId: data.receiverId,
                        status: 'notseen',
                    },
                    raw: true
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    countNotSeen: res.length
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    sendMessage: sendMessage,
    getMessage: getMessage,
    getAllMessage: getAllMessage,
    seenMessage: seenMessage,
    getNotSeenMessage: getNotSeenMessage,
};
