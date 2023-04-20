import db from "../models/index";


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
                        amount: 0,
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
                        userId: userId
                    },
                    attributes: ['userId', 'paintId', 'amount', 'color', 'status'],
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
    addToCart: addToCart,
    getAllCartById: getAllCartById,
};
