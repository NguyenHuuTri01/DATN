import db from "../models/index";
const { Op } = require("sequelize");

let createOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.userName || !data.transactionId || !data.email ||
                !data.address || !data.phonenumber || !data.typePayment
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let resCreate = await db.Customer.create({
                    userId: data.userId,
                    userName: data.userName,
                    transactionId: data.transactionId,
                    email: data.email,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    typePayment: data.typePayment,
                    transportStatus: 'chua'
                })
                if (resCreate) {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: 'Create failed'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getTransactionById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Customer.findAll({
                    order: [["createdAt", "DESC"]],
                    where: {
                        userId: userId,
                        typePayment: {
                            [Op.not]: 'pending'
                        }
                    },
                    attributes: ['transactionId', 'typePayment', 'transportStatus'],
                    raw: true,
                })
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getAllTransaction = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Customer.findAll({
                order: [["createdAt", "DESC"]],
                where: {
                    typePayment: {
                        [Op.not]: ['pending', 'cancel']
                    }
                },
                raw: true,
            })
            if (!data) data = {}
            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}
let getAllCancelOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Customer.findAll({
                order: [["createdAt", "DESC"]],
                where: {
                    transportStatus: 'cancel'
                },
                raw: true,
            })
            if (!data) data = {}
            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}
let updateTransport = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.transactionId || !data.transportStatus) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                })
            } else {
                let customer = await db.Customer.findOne({
                    where: {
                        transactionId: data.transactionId,
                    },
                    raw: false
                })
                if (customer) {
                    customer.transportStatus = data.transportStatus
                    await customer.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Ok',
                    })
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: 'Order not found',
                    })
                }
            }

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createOrder: createOrder,
    getTransactionById: getTransactionById,
    getAllTransaction: getAllTransaction,
    updateTransport: updateTransport,
    getAllCancelOrder: getAllCancelOrder,
};
