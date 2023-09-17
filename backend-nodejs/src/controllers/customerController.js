import customerServices from '../services/customerServices';


let createOrder = async (req, res) => {
    try {
        let infor = await customerServices.createOrder(req.body);
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

let getTransactionById = async (req, res) => {
    try {
        let infor = await customerServices.getTransactionById(req.query.userId);
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
let getAllTransaction = async (req, res) => {
    try {
        let infor = await customerServices.getAllTransaction();
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
let getAllCancelOrder = async (req, res) => {
    try {
        let infor = await customerServices.getAllCancelOrder();
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
let updateTransport = async (req, res) => {
    try {
        let infor = await customerServices.updateTransport(req.body);
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
let sumNumberItemBought = async (req, res) => {
    try {
        let infor = await customerServices.sumNumberItemBought();
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
    createOrder: createOrder,
    getTransactionById: getTransactionById,
    getAllTransaction: getAllTransaction,
    updateTransport: updateTransport,
    getAllCancelOrder: getAllCancelOrder,
    sumNumberItemBought: sumNumberItemBought,
};
