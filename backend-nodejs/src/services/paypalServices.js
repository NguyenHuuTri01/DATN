import db from "../models/index";

let createPaypal = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.length > 0) {
                data.map((item) => {
                    if (!item.userId || !item.paintId || !item.amount ||
                        !item.transactionId || !item.payerEmail || !item.paymentStatus ||
                        !item.paymentAmount || !item.currencyCode || !item.paymentDate
                    ) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Missing parameter'
                        })
                        return
                    }
                })
            }
            data.map(async (item) => {
                let findProduct = await db.Product.findOne({
                    attributes: ["paintQuantity", "numberSold"],
                    where: {
                        paintId: item.paintId
                    },
                    raw: false,
                });
                if (findProduct && +findProduct.dataValues.paintQuantity >= +item.amount) {
                    await db.PayPaypal.create({
                        userId: item.userId,
                        paintId: item.paintId,
                        amount: item.amount,
                        transactionId: item.transactionId,
                        payerEmail: item.payerEmail,
                        paymentStatus: item.paymentStatus,
                        paymentAmount: item.paymentAmount,
                        currencyCode: item.currencyCode,
                        paymentDate: item.paymentDate
                    })
                    let updatNumberSold = await db.Product.findOne({
                        where: {
                            paintId: item.paintId
                        },
                        raw: false,
                    });
                    updatNumberSold.paintQuantity = +findProduct.dataValues.paintQuantity - (+item.amount)
                    updatNumberSold.numberSold = +findProduct.dataValues.numberSold + (+item.amount);
                    await updatNumberSold.save();
                }
            })
            resolve({
                errCode: 0,
                errMessage: 'ok'
            })

        } catch (e) {
            reject(e);
        }
    })
}

let getHistoryPayment = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.PayPaypal.findAll({
                    where: {
                        userId: userId,
                    },
                    attributes: ['paintId', 'amount', 'color', 'transactionId', 'payerEmail',
                        'paymentStatus', 'paymentAmount', 'currencyCode', 'paymentDate'
                    ],
                    include: [
                        {
                            model: db.Product,
                            as: 'productPaypal',
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
                        item.productPaypal.image = new Buffer.from(item.productPaypal.image, "base64").toString("binary");
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
let updateCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.paintId) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing require parameters",
                });
                return;
            }
            let cartItem = await db.Cart.findOne({
                where: {
                    userId: data.userId,
                    paintId: data.paintId
                },
                raw: false,
            });
            if (cartItem) {
                cartItem.amount = data.amount;
                await cartItem.save();
                resolve({
                    errCode: 0,
                    message: "Update succeeds!",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Paint's not found!`,
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let updateStatusCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.paintId) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing require parameters",
                });
                return;
            }
            let cartItem = await db.Cart.findOne({
                where: {
                    userId: data.userId,
                    paintId: data.paintId,
                    status: 'pending'
                },
                raw: false,
            });
            if (cartItem) {
                cartItem.status = 'complete';
                await cartItem.save();
                resolve({
                    errCode: 0,
                    message: "Update succeeds!",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Paint's not found!`,
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let delelteCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.paintId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing require parameters",
                });
            }
            let cartItem = await db.Cart.findOne({
                where: {
                    userId: data.userId,
                    paintId: data.paintId,
                    status: 'pending'
                },
                raw: false,
            });
            if (!cartItem) {
                resolve({
                    errCode: 2,
                    errMessage: `The paint isn't exists`,
                });
            }
            await db.Cart.destroy({
                where: {
                    userId: data.userId,
                    paintId: data.paintId,
                    status: 'pending'
                },
            });
            resolve({
                errCode: 0,
                message: "The paint is deleted",
            });

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createPaypal: createPaypal,
    getHistoryPayment: getHistoryPayment,
};
