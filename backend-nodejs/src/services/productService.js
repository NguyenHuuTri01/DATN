import db from "../models/index";
const { Op } = require("sequelize");

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
            await db.Product.destroy({
                where: { paintCatelory: data.paintId },
            });
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

let createPaintProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.paintId
                || !data.paintName
                || !data.paintPrice
                || !data.paintCatelory
                || !data.imageBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let resCreate = await db.Product.findOrCreate({
                    where: { paintId: data.paintId },
                    defaults: {
                        paintId: data.paintId,
                        paintName: data.paintName,
                        paintPrice: data.paintPrice,
                        paintQuantity: data.paintQuantity,
                        paintCatelory: data.paintCatelory,
                        image: data.imageBase64,
                        numberSold: 0
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
let getAllPaintProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Product.findAll(
                {
                    order: [["createdAt", "DESC"]],
                }
            );
            if (data && data.length > 0) {

                data.map(item => {
                    item.image = new Buffer(item.image, "base64").toString("binary");
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
                        data[i].paintDiscount = productDiscount.valueDiscount;
                        data[i].startDate = productDiscount.startDate
                        data[i].endDate = productDiscount.endDate
                    } else {
                        data[i].paintDiscount = 0;
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data
                })
            } else {
                resolve({
                    errCode: -1,
                    errMessage: 'Data not found',
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}


let editPaintProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.paintId
                || !data.paintName
                || !data.paintPrice
                || !data.paintCatelory
                || !data.imageBase64
            ) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing require parameters",
                });
                return;
            }
            let paint = await db.Product.findOne({
                where: { paintId: data.paintId },
                raw: false,
            });
            if (paint) {
                paint.paintId = data.paintId;
                paint.paintName = data.paintName;
                paint.paintPrice = data.paintPrice;
                paint.paintQuantity = data.paintQuantity;
                paint.paintCatelory = data.paintCatelory;
                paint.image = data.imageBase64;
                await paint.save();
                resolve({
                    errCode: 0,
                    message: "Update the paint succeeds!",
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

let deleltePaintProduct = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let paint = await db.Product.findOne({
                where: { paintId: inputId },
            });
            if (!paint) {
                resolve({
                    errCode: 2,
                    errMessage: `The paint isn't exists`,
                });
                return
            }
            await db.Product.destroy({
                where: { paintId: inputId },
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

let getDataSelectProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Product.findAll({
                order: [["createdAt", "DESC"]],
                attributes: ['id', 'paintId', 'paintName']
            });
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


let getTopPaintProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Product.findAll(
                {
                    limit: 10,
                    order: [["numberSold", "DESC"]],
                    attributes: ["id", "paintId", "paintName", "image"],
                    raw: true,
                }
            );
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, "base64").toString("binary");
                    return item;
                })
            }
            if (!data) data = {}
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
    createLoaiSon: createLoaiSon,
    getAllLoaiSon: getAllLoaiSon,
    editLoaiSon: editLoaiSon,
    delelteLoaiSon: delelteLoaiSon,
    createPaintProduct: createPaintProduct,
    getAllPaintProduct: getAllPaintProduct,
    editPaintProduct: editPaintProduct,
    deleltePaintProduct: deleltePaintProduct,
    getDataSelectProduct: getDataSelectProduct,
    getTopPaintProduct: getTopPaintProduct,
};
