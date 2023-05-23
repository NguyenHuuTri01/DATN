import paintPackServices from "../services/paintPackServices";


let createPaintPack = async (req, res) => {
    try {
        let infor = await paintPackServices.createPaintPack(req.body);
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
let updatePaintPack = async (req, res) => {
    try {
        let infor = await paintPackServices.updatePaintPack(req.body);
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
let getPaintPackById = async (req, res) => {
    try {
        let infor = await paintPackServices.getPaintPackById(req.query.id);
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
let deletePaintPack = async (req, res) => {
    try {
        let infor = await paintPackServices.deletePaintPack(req.body.id);
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
let getAllPaintPack = async (req, res) => {
    try {
        let infor = await paintPackServices.getAllPaintPack();
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
    createPaintPack: createPaintPack,
    updatePaintPack: updatePaintPack,
    getPaintPackById: getPaintPackById,
    getAllPaintPack: getAllPaintPack,
    deletePaintPack: deletePaintPack,
};
