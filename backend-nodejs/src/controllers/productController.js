import productService from '../services/productService';

let createLoaiSon = async (req, res) => {
    try {
        let infor = await productService.createLoaiSon(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllLoaiSon = async (req, res) => {
    try {
        let infor = await productService.getAllLoaiSon();
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let editLoaiSon = async (req, res) => {
    try {
        let infor = await productService.editLoaiSon(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let delelteLoaiSon = async (req, res) => {
    try {
        let infor = await productService.delelteLoaiSon(req.body.paintId);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let createPaintProduct = async (req, res) => {
    try {
        let infor = await productService.createPaintProduct(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getAllPaintProduct = async (req, res) => {
    try {
        let infor = await productService.getAllPaintProduct();
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
// let getPaintProductById = async (req, res) => {
//     try {
//         let infor = await productService.getPaintProductById(req.query.id);
//         return res.status(200).json(
//             infor
//         )
//     } catch (e) {
//         console.log(e);
//         return res.status(200).json({
//             errCode: -1,
//             errMessage: 'Error from the server'
//         })
//     }
// }
let editPaintProduct = async (req, res) => {
    try {
        let infor = await productService.editPaintProduct(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let deleltePaintProduct = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!",
        });
    }
    let message = await productService.deleltePaintProduct(req.body.id);
    return res.status(200).json(message);
}

let getDataSelectProduct = async (req, res) => {
    try {
        let infor = await productService.getDataSelectProduct();
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getTopPaintProduct = async (req, res) => {
    try {
        let infor = await productService.getTopPaintProduct();
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
module.exports = {
    createLoaiSon: createLoaiSon,
    getAllLoaiSon: getAllLoaiSon,
    editLoaiSon: editLoaiSon,
    delelteLoaiSon: delelteLoaiSon,
    createPaintProduct: createPaintProduct,
    getAllPaintProduct: getAllPaintProduct,
    // getPaintProductById: getPaintProductById,
    editPaintProduct: editPaintProduct,
    deleltePaintProduct: deleltePaintProduct,
    getDataSelectProduct: getDataSelectProduct,
    getTopPaintProduct: getTopPaintProduct,
};
