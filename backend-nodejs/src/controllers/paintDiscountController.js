import paintDiscountServices from '../services/paintDiscountServices'

let createPaintDiscount = async (req, res) => {
    try {
        let infor = await paintDiscountServices.createPaintDiscount(req.body);
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
let updatePaintDiscount = async (req, res) => {
    try {
        let infor = await paintDiscountServices.updatePaintDiscount(req.body);
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
let getPaintDiscountById = async (req, res) => {
    try {
        let infor = await paintDiscountServices.getPaintDiscountById(req.query.id);
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
let deletePaintDiscount = async (req, res) => {
    try {
        let infor = await paintDiscountServices.deletePaintDiscount(req.body.id);
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
let getAllPaintDiscount = async (req, res) => {
    try {
        let infor = await paintDiscountServices.getAllPaintDiscount(req.query.paintId);
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
    createPaintDiscount: createPaintDiscount,
    updatePaintDiscount: updatePaintDiscount,
    getPaintDiscountById: getPaintDiscountById,
    deletePaintDiscount: deletePaintDiscount,
    getAllPaintDiscount: getAllPaintDiscount
};