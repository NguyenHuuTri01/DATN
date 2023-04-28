import detailServices from '../services/detailServices';

let createInformationPaint = async (req, res) => {
    try {
        let infor = await detailServices.createInformationPaint(req.body);
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
let updateInformationPaint = async (req, res) => {
    try {
        let infor = await detailServices.updateInformationPaint(req.body);
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
let getInformationById = async (req, res) => {
    try {
        let infor = await detailServices.getInformationById(req.query.paintId);
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
    createInformationPaint: createInformationPaint,
    updateInformationPaint: updateInformationPaint,
    getInformationById: getInformationById,
};
