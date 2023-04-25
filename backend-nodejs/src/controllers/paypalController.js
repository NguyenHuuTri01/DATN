import paypalServices from '../services/paypalServices';


let createPaypal = async (req, res) => {
    try {
        let infor = await paypalServices.createPaypal(req.body);
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


let updatePaypal = async (req, res) => {
    try {
        let infor = await paypalServices.updatePaypal(req.body);
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


let deletePaypal = async (req, res) => {
    try {
        let infor = await paypalServices.deletePaypal(req.body);
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

let getHistoryPaypal = async (req, res) => {
    try {
        let infor = await paypalServices.getHistoryPaypal(req.query.userId);
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
        let infor = await paypalServices.getOrderByTransaction(req.body.transactionId);
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

let getAllOrderPaypal = async (req, res) => {
    try {
        let infor = await paypalServices.getAllOrderPaypal();
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
let cancelOrderPaypal = async (req, res) => {
    try {
        let infor = await paypalServices.cancelOrderPaypal(req.body.transactionId);
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
    createPaypal: createPaypal,
    updatePaypal: updatePaypal,
    deletePaypal: deletePaypal,
    getHistoryPaypal: getHistoryPaypal,
    getAllOrderPaypal: getAllOrderPaypal,
    cancelOrderPaypal: cancelOrderPaypal,
    getOrderByTransaction: getOrderByTransaction,
};
