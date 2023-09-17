import cartServices from '../services/cartServices';


let addToCart = async (req, res) => {
    try {
        let infor = await cartServices.addToCart(req.body);
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

let getAllCartById = async (req, res) => {
    try {
        let infor = await cartServices.getAllCartById(req.query.userId);
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
    addToCart: addToCart,
    getAllCartById: getAllCartById,
    updateCart: updateCart,
    delelteCart: delelteCart,
    updateStatusCart: updateStatusCart,
};
