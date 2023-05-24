import db from "../models/index";
const { Op } = require("sequelize");

let addToCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.paintId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let resCreate = await db.Cart.findOrCreate({
                    where: {
                        userId: data.userId,
                        paintId: data.paintId,
                        status: 'pending'
                    },
                    defaults: {
                        userId: data.userId,
                        paintId: data.paintId,
                        status: 'pending',
                        amount: 1,
                        color: data.color
                    }
                })
                if (resCreate && resCreate[1]) {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                } else {
                    resolve({
                        errCode: -2,
                        errMessage: 'Item is exist'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCartById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Cart.findAll({
                    where: {
                        userId: userId,
                        status: 'pending'
                    },
                    attributes: ['userId', 'paintId', 'amount', 'color', 'status'],
                    include: [
                        {
                            model: db.Product,
                            as: 'productData',
                            attributes: [
                                'id', 'paintName', 'paintPrice', 'paintDiscount',
                                'paintQuantity', 'paintCatelory', 'image'
                            ]
                        }
                    ],
                    raw: true,
                    nest: true,
                })
                if (data && data.length > 0) {
                    data.map(item => {
                        item.productData.image = new Buffer.from(item.productData.image, "base64").toString("binary");
                        return item;
                    })
                    for (let i = 0; i < data.length; i++) {
                        let productDiscount = await db.PaintDiscount.findOne({
                            where: {
                                paintId: data[i].paintId,
                                startDate: {
                                    [Op.lte]: new Date()
                                },
                                endDate: {
                                    [Op.gte]: new Date()
                                }
                            }
                        });
                        if (productDiscount) {
                            data[i].productData.paintDiscount = productDiscount.valueDiscount;
                        } else {
                            data[i].productData.paintDiscount = 0;
                        }
                    }
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
    addToCart: addToCart,
    getAllCartById: getAllCartById,
    updateCart: updateCart,
    delelteCart: delelteCart,
    updateStatusCart: updateStatusCart,
};
