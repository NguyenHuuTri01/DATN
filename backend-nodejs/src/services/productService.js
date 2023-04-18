import db from "../models/index";


let createLoaiSon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.paintId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let resCreate = await db.LoaiSon.findOrCreate({
                    where: { paintId: data.paintId },
                    defaults: {
                        paintId: data.paintId,
                        name: data.name
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
                        errMessage: 'Item is exist'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getAllLoaiSon = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.LoaiSon.findAll(
                {
                    order: [["createdAt", "DESC"]],
                }
            );
            if (!data) {
                data = {};
            }
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
let editLoaiSon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.paintId) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing require parameters",
                });
                return;
            }
            let loaison = await db.LoaiSon.findOne({
                where: { paintId: data.paintId },
                raw: false,
            });
            if (loaison) {
                loaison.name = data.name;
                loaison.paintId = data.paintId;
                await loaison.save();
                resolve({
                    errCode: 0,
                    message: "Update the loaison succeeds!",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Loaison's not found!`,
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
let delelteLoaiSon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let loaison = await db.LoaiSon.findOne({
                where: { paintId: data.paintId },
            });
            if (!loaison) {
                resolve({
                    errCode: 2,
                    errMessage: `The loaison isn't exists`,
                });
            }
            await db.LoaiSon.destroy({
                where: { paintId: data.paintId },
            });
            resolve({
                errCode: 0,
                message: "The loaison is deleted",
            });

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createLoaiSon: createLoaiSon,
    getAllLoaiSon: getAllLoaiSon,
    editLoaiSon: editLoaiSon,
    delelteLoaiSon: delelteLoaiSon,
};
