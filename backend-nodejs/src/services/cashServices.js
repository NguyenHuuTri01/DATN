import db from "../models/index";
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
const { Op } = require("sequelize");

let buildUrlEmail = (transactionId, userId) => {
    let result = `${process.env.REACT_URL}/verify-order?transactionId=${transactionId}&userId=${userId}`;
    return result;
}
let createCashOnReceipt = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.length > 0) {
                data.map((item) => {
                    if (!item.userId || !item.paintId || !item.amount || !item.phonenumber
                        || !item.email || !item.address) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Missing parameter'
                        })
                        return
                    }
                })
            }
            let lengdata = data.length
            let statusCreate = true;
            let token = uuidv4();
            for (let i = 0; i < lengdata; i++) {
                let quantity = await db.Product.findOne({
                    attributes: ["paintQuantity", "numberSold"],
                    where: {
                        paintId: data[i].paintId
                    },
                    raw: false,
                });
                if (quantity.paintQuantity < data[i].amount) {
                    statusCreate = false;
                    break;
                } else {
                    await db.CashOnReceipt.create({
                        userId: data[i].userId,
                        paintId: data[i].paintId,
                        amount: data[i].amount,
                        color: data[i].color,
                        makePrice: data[i].productData.paintPrice,
                        discount: data[i].productData.paintDiscount,
                        transactionId: token,
                        status: ''
                    })
                }
            }
            if (statusCreate) {
                await db.Customer.create({
                    userId: data[0].userId,
                    userName: data[0].userName,
                    transactionId: token,
                    email: data[0].email,
                    address: data[0].address,
                    phonenumber: data[0].phonenumber,
                    typePayment: 'pending',
                    transportStatus: 'chua'
                })
                await emailService.sendAcceptOrder({
                    reciverEmail: data[0].email,
                    userName: data[0].userName,
                    transactionId: token,
                    redirectLink: buildUrlEmail(token, data[0].userId)
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Đặt Hàng Thành Công'
                })
            } else {
                data.map(async (item) => {
                    let getAmount = await db.CashOnReceipt.findOne({
                        attributes: ["amount"],
                        where: {
                            userId: item.userId,
                            paintId: item.paintId,
                            amount: item.amount,
                            transactionId: token
                        },
                        raw: false,
                    });

                    // if (getAmount) {
                    //     let resetamount = await db.Product.findOne({
                    //         attributes: ["paintQuantity", "numberSold"],
                    //         where: {
                    //             paintId: item.paintId
                    //         },
                    //         raw: false,
                    //     })
                    // }

                    await db.CashOnReceipt.destroy({
                        where: {
                            userId: item.userId,
                            paintId: item.paintId,
                            transactionId: token
                        }
                    });
                })
                resolve({
                    errCode: -2,
                    errMessage: 'Đặt Hàng Thất Bại'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let postVerifyOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.transactionId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let verifyOrder = await db.Customer.findOne({
                    where: {
                        userId: data.userId,
                        transactionId: data.transactionId,
                        typePayment: 'pending'
                    },
                    raw: false
                })
                if (verifyOrder) {
                    verifyOrder.typePayment = 'cashonreceipt'
                    verifyOrder.save();

                    let updatequantity = await db.CashOnReceipt.findAll({
                        attributes: ["paintId", "amount"],
                        where: {
                            userId: data.userId,
                            transactionId: data.transactionId,
                        },
                        raw: false,
                    })
                    if (updatequantity && updatequantity.length > 0) {
                        updatequantity.map(async (item) => {
                            let verify = await db.CashOnReceipt.findOne({
                                where: {
                                    paintId: item.paintId,
                                    transactionId: data.transactionId
                                },
                                raw: false,
                            })
                            verify.status = "complete"
                            verify.save();

                            let quantity = await db.Product.findOne({
                                attributes: ["paintQuantity", "numberSold"],
                                where: {
                                    paintId: item.paintId
                                },
                                raw: false,
                            });
                            let update = await db.Product.findOne({
                                where: {
                                    paintId: item.paintId
                                },
                                raw: false,
                            })
                            update.paintQuantity = +quantity.dataValues.paintQuantity - (+item.amount)
                            update.numberSold = +quantity.dataValues.numberSold + (+item.amount);
                            await update.save();
                        })
                    }
                    resolve({
                        errCode: 0,
                        errMessage: "Accept success!"
                    })
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: "Accept failed!"
                    })
                }

            }
        } catch (e) {
            reject(e);
        }
    })
}
let getHistoryCash = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.CashOnReceipt.findAll({
                    where: {
                        userId: userId,
                        status: ['complete', 'cancel'],
                    },
                    include: [
                        {
                            model: db.Product,
                            as: 'cashProduct',
                            attributes: [
                                'paintName', 'image'
                            ]
                        },
                        {
                            model: db.Customer,
                            as: 'customerCash',
                            attributes: [
                                'typePayment', 'transportStatus'
                            ]
                        }
                    ],
                    raw: true,
                    nest: true,
                })
                if (data && data.length > 0) {
                    data.map(item => {
                        item.cashProduct.image = new Buffer.from(item.cashProduct.image, "base64").toString("binary");
                        return item;
                    })
                }
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
let getOrderByTransaction = (transactionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!transactionId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.CashOnReceipt.findAll({
                    order: [["createdAt", "DESC"]],
                    where: {
                        transactionId: transactionId,
                        status: ['complete'],
                    },
                    include: [
                        {
                            model: db.Product,
                            as: 'cashProduct',
                            attributes: [
                                'paintName', 'image'
                            ]
                        }
                    ],
                    raw: true,
                    nest: true,
                })
                if (data && data.length > 0) {
                    data.map(item => {
                        item.cashProduct.image = new Buffer.from(item.cashProduct.image, "base64").toString("binary");
                        return item;
                    })
                }
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

let getAllOrderCash = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.CashOnReceipt.findAll({
                where: {
                    status: 'complete'
                },
                include: [
                    {
                        model: db.Product,
                        as: 'cashProduct',
                        attributes: [
                            'paintName', 'image'
                        ]
                    },
                    {
                        model: db.Customer,
                        as: 'customerCash',
                        attributes: [
                            'userName', 'typePayment', 'transportStatus', 'email',
                            'address', 'phonenumber'
                        ]
                    }
                ],
                raw: true,
                nest: true,
            })
            if (data && data.length > 0) {
                data.map(item => {
                    item.cashProduct.image = new Buffer.from(item.cashProduct.image, "base64").toString("binary");
                    return item;
                })
            }
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

let cancelOrderCash = (transactionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let getCash = await db.CashOnReceipt.findAll({
                where: {
                    transactionId: transactionId,
                    status: 'complete'
                },
                raw: false
            })
            if (getCash && getCash.length > 0) {
                getCash.map(async (item) => {
                    let product = await db.Product.findOne({
                        where: {
                            paintId: item.paintId
                        },
                        attributes: ['paintQuantity', 'numberSold'],
                        raw: false
                    })
                    if (product) {
                        let updateProduct = await db.Product.findOne({
                            where: {
                                paintId: item.paintId
                            },
                            raw: false
                        })
                        updateProduct.paintQuantity = +product.dataValues.paintQuantity + (+item.amount)
                        updateProduct.numberSold = +product.dataValues.numberSold - (+item.amount)
                        await updateProduct.save();

                        let updateCash = await db.CashOnReceipt.findOne({
                            where: {
                                paintId: item.paintId,
                                transactionId: transactionId
                            },
                            raw: false
                        })
                        updateCash.status = 'cancel'
                        await updateCash.save();

                        let updateCustomer = await db.Customer.findOne({
                            where: {
                                transactionId: transactionId
                            },
                            raw: false
                        })
                        updateCustomer.transportStatus = 'cancel'
                        await updateCustomer.save();
                    }
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            } else {
                resolve({
                    errCode: -1,
                    errMessage: 'Đã Hủy Ở Lần Trước'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createCashOnReceipt: createCashOnReceipt,
    postVerifyOrder: postVerifyOrder,
    getHistoryCash: getHistoryCash,
    getAllOrderCash: getAllOrderCash,
    cancelOrderCash: cancelOrderCash,
    getOrderByTransaction: getOrderByTransaction,
};
