import db from "../models/index";

let sendMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.senderId || !data.receiverId || data.message) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Message.create({
                    senderId: data.email,
                    receiverId: hashPasswordFromBcrypt,
                    message: data.name,
                    address: data.address,
                    status: 'notseen',
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let seenMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.senderId || !data.receiverId || data.message) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Message.create({
                    senderId: data.email,
                    receiverId: hashPasswordFromBcrypt,
                    message: data.name,
                    address: data.address,
                    status: 'notseen',
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    sendMessage: sendMessage,
};
