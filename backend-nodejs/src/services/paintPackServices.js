import db from "../models/index";

let createPaintPack = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let resCreate = await db.PaintPack.findOrCreate({
                    where: {
                        name: data.name,
                    },
                    defaults: {
                        name: data.name,
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
let updatePaintPack = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let findPack = await db.PaintPack.findOne({
                    where: {
                        name: data.name,
                    },
                    raw: false
                })
                if (findPack) {
                    findPack.contentHTML = data.descriptionHTML
                    findPack.contentMarkdown = data.descriptionMarkdown
                    await findPack.save();
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
let getPaintPackById = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!name) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let findPack = await db.PaintPack.findOne({
                    where: {
                        name: name,
                    },
                    raw: true,
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    findPack
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createPaintPack: createPaintPack,
    updatePaintPack: updatePaintPack,
    getPaintPackById: getPaintPackById,
};
