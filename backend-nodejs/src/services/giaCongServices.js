import db from "../models/index";

let submitForm = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.customerName || !data.address || !data.phonenumber
                || !data.email || !data.loaiCongTrinh || !data.dientich
                || !data.paintPackId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.GiaCong.create({
                    customerName: data.customerName,
                    userId: data.userId,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    email: data.email,
                    loaiCongTrinh: data.loaiCongTrinh,
                    area: data.dientich,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    require: data.require,
                    paintPack: data.paintPackId,
                    status: 'pending'
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getGiaCong = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.GiaCong.findAll({
                where: {
                    status: 'pending'
                },
                include: [
                    {
                        model: db.PaintPack,
                        as: 'dataPaintPack',
                        attributes: [
                            'name',
                        ]
                    },
                ],
                raw: true,
                nest: true,
            })
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}
let getGiaCongById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.GiaCong.findAll({
                where: {
                    userId: userId
                },
                order: [["createdAt", "DESC"]],
                attributes: ['id', 'address', 'loaiCongTrinh', 'area', 'paintPack', 'status'],
                include: [
                    {
                        model: db.PaintPack,
                        as: 'dataPaintPack',
                        attributes: [
                            'name',
                        ]
                    },
                ],
                raw: true,
                nest: true,
            })
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let nhanGiaCong = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.constructorId || !inputData.id) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parameter',
                })
            } else {
                let data = await db.GiaCong.findOne({
                    where: {
                        id: inputData.id,
                        status: 'pending'
                    },
                    raw: false
                })
                if (data) {
                    data.status = inputData.status
                    data.constructorId = inputData.constructorId
                    let resUpdate = await data.save();
                    if (resUpdate) {
                        resolve({
                            errCode: 0,
                            errMessage: 'ok',
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'failed',
                        })
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}
let hoanThanh = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.constructorId || !inputData.id) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parameter',
                })
            } else {
                let data = await db.GiaCong.findOne({
                    where: {
                        id: inputData.id,
                        constructorId: inputData.constructorId,
                        status: 'datiepnhan'
                    },
                    raw: false
                })
                if (data) {
                    data.status = inputData.status
                    let resUpdate = await data.save();
                    if (resUpdate) {
                        resolve({
                            errCode: 0,
                            errMessage: 'ok',
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'failed',
                        })
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let nhanGiaCongById = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput.constructorId) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parameter',
                })
            } else {
                let data = await db.GiaCong.findAll({
                    order: [["createdAt", "DESC"]],
                    where: {
                        constructorId: dataInput.constructorId,
                    },
                    raw: false
                })
                if (data) {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok',
                        data
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let cancelGiaCong = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.id) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parameter',
                })
            } else {
                let data = await db.GiaCong.findOne({
                    where: {
                        id: inputData.id,
                        status: 'pending'
                    },
                    raw: false
                })
                if (data) {
                    data.status = 'cancel'
                    let resUpdate = await data.save();
                    if (resUpdate) {
                        resolve({
                            errCode: 0,
                            errMessage: 'ok',
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'failed',
                        })
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    submitForm: submitForm,
    getGiaCong: getGiaCong,
    nhanGiaCong: nhanGiaCong,
    nhanGiaCongById: nhanGiaCongById,
    hoanThanh: hoanThanh,
    getGiaCongById: getGiaCongById,
    cancelGiaCong: cancelGiaCong,
};
