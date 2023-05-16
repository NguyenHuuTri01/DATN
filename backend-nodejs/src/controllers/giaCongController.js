import giaCongServices from '../services/giaCongServices';


let submitForm = async (req, res) => {
    try {
        let infor = await giaCongServices.submitForm(req.body);
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
let getGiaCong = async (req, res) => {
    try {
        let infor = await giaCongServices.getGiaCong();
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
let getGiaCongById = async (req, res) => {
    try {
        let infor = await giaCongServices.getGiaCongById(req.query.userId);
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
let nhanGiaCong = async (req, res) => {
    try {
        let infor = await giaCongServices.nhanGiaCong(req.body);
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
let nhanGiaCongById = async (req, res) => {
    try {
        let infor = await giaCongServices.nhanGiaCongById(req.body);
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
let hoanThanh = async (req, res) => {
    try {
        let infor = await giaCongServices.hoanThanh(req.body);
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

let cancelGiaCong = async (req, res) => {
    try {
        console.log(req.body)
        let infor = await giaCongServices.cancelGiaCong(req.body);
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
    submitForm: submitForm,
    getGiaCong: getGiaCong,
    nhanGiaCong: nhanGiaCong,
    nhanGiaCongById: nhanGiaCongById,
    hoanThanh: hoanThanh,
    getGiaCongById: getGiaCongById,
    cancelGiaCong: cancelGiaCong,
};
