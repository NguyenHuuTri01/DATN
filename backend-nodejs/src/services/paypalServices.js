import db from "../models/index";


let createPaypal = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.length > 0) {
                data.map((item) => {
                    if (!item.userId || !item.paintId || !item.amount) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Missing parameter'
                        })
                        return
                    }
                })
            }
            let lengthData = data.length
            for (let i = 0; i < lengthData; i++) {
                let quantity = await db.Product.findOne({
                    attributes: ["paintQuantity", "numberSold"],
                    where: {
                        paintId: data[i].paintId
                    },
                    raw: false,
                });
                if (quantity.paintQuantity < data[i].amount) {
                    resolve({
                        errCode: 1,
                        errMessage: 'quantity is not enough'
                    })
                    return;
                } else {
                    await db.PayPaypal.create({
                        userId: data[i].userId,
                        paintId: data[i].paintId,
                        amount: data[i].amount,
                        makePrice: data[i].productData.paintPrice,
                        discount: data[i].productData.paintDiscount,
                        paymentStatus: 'pendingpayment'
                    })
                    let updatNumberSold = await db.Product.findOne({
                        where: {
                            paintId: data[i].paintId
                        },
                        raw: false,
                    });
                    updatNumberSold.paintQuantity = +quantity.dataValues.paintQuantity - (+data[i].amount)
                    updatNumberSold.numberSold = +quantity.dataValues.numberSold + (+data[i].amount);
                    await updatNumberSold.save();
                }
            }
            resolve({
                errCode: 0,
                errMessage: 'ok'
            })

        } catch (e) {
            reject(e);
        }
    })
}

let updatePaypal = (data) => {
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
                let updatepaypal = await db.PayPaypal.findOne({
                    where: {
                        userId: item.userId,
                        paintId: item.paintId,
                        paymentStatus: 'pendingpayment'
                    },
                    raw: false,
                });
                if (updatepaypal) {
                    updatepaypal.transactionId = item.transactionId
                    updatepaypal.payerEmail = item.payerEmail
                    updatepaypal.paymentStatus = item.paymentStatus
                    updatepaypal.paymentAmount = item.paymentAmount
                    updatepaypal.currencyCode = item.currencyCode
                    updatepaypal.paymentDate = item.paymentDate
                    await updatepaypal.save()
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

let deletePaypal = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.length > 0) {
                data.map((item) => {
                    if (!item.userId || !item.paintId || !item.amount) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Missing parameter'
                        })
                        return
                    }
                })
            }

            data.map(async (item) => {
                let getAmount = await db.PayPaypal.findOne({
                    attributes: ["amount"],
                    where: {
                        userId: item.userId,
                        paintId: item.paintId,
                        amount: item.amount,
                        paymentStatus: 'pendingpayment'
                    },
                    raw: false,
                });
                if (getAmount) {
                    let resetamount = await db.Product.findOne({
                        attributes: ["paintQuantity", "numberSold"],
                        where: {
                            paintId: item.paintId
                        },
                        raw: false,
                    })
                    let update = await db.Product.findOne({
                        where: {
                            paintId: item.paintId
                        },
                        raw: false,
                    })
                    update.paintQuantity = +resetamount.dataValues.paintQuantity + (+getAmount.amount)
                    update.numberSold = +resetamount.dataValues.numberSold - (+getAmount.amount)
                    await update.save();
                }

                await db.PayPaypal.destroy({
                    where: {
                        userId: item.userId,
                        paintId: item.paintId,
                        paymentStatus: 'pendingpayment'
                    }
                });
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



let getHistoryPaypal = (userId) => {
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


module.exports = {
    updatePaypal: updatePaypal,
    getHistoryPaypal: getHistoryPaypal,
    createPaypal: createPaypal,
    deletePaypal: deletePaypal,
};
