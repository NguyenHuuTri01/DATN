import db from "../models/index";
const { Op } = require("sequelize");

let createPaintDiscount = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.paintId || !data.startDate || !data.endDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let findDiscount = await db.PaintDiscount.findAll({
                    where: {
                        paintId: data.paintId,
                        startDate: {
                            // startDate phải nhỏ hơn hoặc bằng inputEndDate
                            [Op.lte]: data.endDate
                        },
                        endDate: {
                            // endDate phải lớn hơn hoặc bằng inputStartDate
                            [Op.gte]: data.startDate
                        }
                    }
                });
                if (findDiscount && findDiscount.length > 0) {
                    resolve({
                        errCode: -1,
                        errMessage: 'already exist',
                    })
                } else {
                    await db.PaintDiscount.create({
                        paintId: data.paintId,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        valueDiscount: data.valueDiscount
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'ok',
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getPaintDiscountById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.PaintDiscount.findOne({
                    where: {
                        id: id,
                    },
                    raw: true,
                })
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

let updatePaintDiscount = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.paintId || !data.startDate || !data.endDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let findDiscount = await db.PaintDiscount.findAll({
                    where: {
                        id: {
                            [Op.not]: data.id
                        },
                        paintId: data.paintId,
                        startDate: {
                            // startDate phải nhỏ hơn hoặc bằng inputEndDate
                            [Op.lte]: data.endDate
                        },
                        endDate: {
                            // endDate phải lớn hơn hoặc bằng inputStartDate
                            [Op.gte]: data.startDate
                        }
                    }
                });
                if (findDiscount && findDiscount.length > 0) {
                    resolve({
                        errCode: -1,
                        errMessage: 'already exist',
                        findDiscount
                    })
                } else {
                    let update = await db.PaintDiscount.findOne({
                        where: {
                            id: data.id,
                        },
                        raw: false
                    })
                    if (update) {
                        update.startDate = data.startDate
                        update.endDate = data.endDate
                        update.valueDiscount = data.valueDiscount
                        await update.save();
                        resolve({
                            errCode: 0,
                            errMessage: 'Ok',
                        })
                    } else {
                        resolve({
                            errCode: -2,
                            errMessage: 'Not found discount'
                        })
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deletePaintDiscount = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let find = await db.PaintDiscount.findOne({
                    where: {
                        id: id,
                    }
                })
                if (!find) {
                    resolve({
                        errCode: 2,
                        errMessage: `The paint pack isn't exists`,
                    });
                }
                await db.PaintDiscount.destroy({
                    where: { id: id },
                });
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

let getAllPaintDiscount = (paintId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!paintId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.PaintDiscount.findAll({
                    where: {
                        paintId: paintId
                    }
                });
                if (data && data.length > 0) {
                    data.map(item => {
                        if (item.startDate > new Date()) {
                            item.isUpdate = true
                        } else {
                            item.isUpdate = false
                        }
                        return item
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
    createPaintDiscount: createPaintDiscount,
    getPaintDiscountById: getPaintDiscountById,
    updatePaintDiscount: updatePaintDiscount,
    deletePaintDiscount: deletePaintDiscount,
    getAllPaintDiscount: getAllPaintDiscount,
};