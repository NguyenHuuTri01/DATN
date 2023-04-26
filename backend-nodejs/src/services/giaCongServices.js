import db from "../models/index";

let submitForm = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.customerName || !data.address || !data.phonenumber
                || !data.email || !data.loaiCongTrinh || !data.dientich || !data.color
                || !data.startDate || !data.endDate
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
                    color: data.color,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    require: data.require,
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
                raw: false
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

module.exports = {
    submitForm: submitForm,
    getGiaCong: getGiaCong,
};
