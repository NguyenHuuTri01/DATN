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

let getHistoryPayment = async (req, res) => {
    try {
        let infor = await paypalServices.getHistoryPayment(req.query.userId);
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

let updateCart = async (req, res) => {
    try {
        let infor = await cartServices.updateCart(req.body);
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
let updateStatusCart = async (req, res) => {
    try {
        let infor = await cartServices.updateStatusCart(req.body);
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

let delelteCart = async (req, res) => {
    try {
        let infor = await cartServices.delelteCart(req.body);
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
    getHistoryPayment: getHistoryPayment,
};
