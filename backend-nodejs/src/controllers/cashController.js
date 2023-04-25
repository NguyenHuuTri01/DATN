import cashServices from '../services/cashServices';


let createCashOnReceipt = async (req, res) => {
    try {
        let infor = await cashServices.createCashOnReceipt(req.body);
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
let postVerifyOrder = async (req, res) => {
    try {
        let infor = await cashServices.postVerifyOrder(req.body);
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
let getHistoryCash = async (req, res) => {
    try {
        let infor = await cashServices.getHistoryCash(req.query.userId);
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
let getOrderByTransaction = async (req, res) => {
    try {
        let infor = await cashServices.getOrderByTransaction(req.body.transactionId);
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
let getAllOrderCash = async (req, res) => {
    try {
        let infor = await cashServices.getAllOrderCash();
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

let cancelOrderCash = async (req, res) => {
    try {
        let infor = await cashServices.cancelOrderCash(req.body.transactionId);
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
    createCashOnReceipt: createCashOnReceipt,
    postVerifyOrder: postVerifyOrder,
    getHistoryCash: getHistoryCash,
    getAllOrderCash: getAllOrderCash,
    cancelOrderCash: cancelOrderCash,
    getOrderByTransaction: getOrderByTransaction
};
