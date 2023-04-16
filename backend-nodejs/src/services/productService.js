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
let delelteLoaiSon = (paintId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let loaison = await db.LoaiSon.findOne({
                where: { paintId: paintId },
            });
            if (!loaison) {
                resolve({
                    errCode: 2,
                    errMessage: `The loaison isn't exists`,
                });
            }
            await db.LoaiSon.destroy({
                where: { paintId: paintId },
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
    delelteLoaiSon: delelteLoaiSon,
};
