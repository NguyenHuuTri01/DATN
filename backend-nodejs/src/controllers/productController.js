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

module.exports = {
    createLoaiSon: createLoaiSon,
    getAllLoaiSon: getAllLoaiSon,
    editLoaiSon: editLoaiSon,
    delelteLoaiSon: delelteLoaiSon,
};
