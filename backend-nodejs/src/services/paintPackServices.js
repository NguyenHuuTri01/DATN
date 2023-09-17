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
            if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let findPack = await db.PaintPack.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false
                })
                if (findPack) {
                    findPack.name = data.name
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
let getPaintPackById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let findPack = await db.PaintPack.findOne({
                    where: {
                        id: id,
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
let deletePaintPack = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let findPack = await db.PaintPack.findOne({
                    where: {
                        id: id,
                    }
                })
                if (!findPack) {
                    resolve({
                        errCode: 2,
                        errMessage: `The paint pack isn't exists`,
                    });
                }
                await db.PaintPack.destroy({
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
let getAllPaintPack = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.PaintPack.findAll(
                {
                    order: [["createdAt", "DESC"]],
                }
            );
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

module.exports = {
    createPaintPack: createPaintPack,
    updatePaintPack: updatePaintPack,
    getPaintPackById: getPaintPackById,
    getAllPaintPack: getAllPaintPack,
    deletePaintPack: deletePaintPack
};
