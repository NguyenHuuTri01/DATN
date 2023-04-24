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

module.exports = {
    createOrder: createOrder,
    getTransactionById: getTransactionById,
};
