import db from "../models/index";

let createInformationPaint = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.paintId || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let resCreate = await db.Detail.findOrCreate({
                    where: {
                        paintId: data.paintId,
                    },
                    defaults: {
                        paintId: data.paintId,
                        contentHTML: data.descriptionHTML,
                        contentMarkdown: data.descriptionMarkdown,
                    }
                })

                if (resCreate && resCreate[1]) {
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
let updateInformationPaint = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.paintId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let findPaint = await db.Detail.findOne({
                    where: {
                        paintId: data.paintId,
                    },
                    raw: false
                })
                if (findPaint) {
                    findPaint.contentHTML = data.descriptionHTML
                    findPaint.contentMarkdown = data.descriptionMarkdown
                    await findPaint.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Ok',
                    })
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: 'Update failed'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getInformationById = (paintId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!paintId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let findPaint = await db.Detail.findOne({
                    where: {
                        paintId: paintId,
                    },
                    include: [
                        {
                            model: db.Product,
                            as: 'detailProduct',
                            attributes: [
                                'paintName', 'image'
                            ]
                        }
                    ],
                    raw: true,
                    nest: true,
                })
                if (findPaint && findPaint.detailProduct.image) {
                    findPaint.detailProduct.image = new Buffer(findPaint.detailProduct.image, "base64").toString("binary")
                    resolve({
                        errCode: 0,
                        errMessage: 'Ok',
                        findPaint
                    })
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: 'Not found'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createInformationPaint: createInformationPaint,
    updateInformationPaint: updateInformationPaint,
    getInformationById: getInformationById,
};
