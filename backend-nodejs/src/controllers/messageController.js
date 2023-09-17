import messageServices from '../services/messageServices';

let sendMessage = async (req, res) => {
    try {
        let infor = await messageServices.sendMessage(req.body);
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
let getMessage = async (req, res) => {
    try {
        let infor = await messageServices.getMessage(req.body);
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
let getAllMessage = async (req, res) => {
    try {
        let infor = await messageServices.getAllMessage(req.body);
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
let seenMessage = async (req, res) => {
    try {
        let infor = await messageServices.seenMessage(req.body);
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

let getNotSeenMessage = async (req, res) => {
    try {
        let infor = await messageServices.getNotSeenMessage(req.body);
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
    sendMessage: sendMessage,
    getMessage: getMessage,
    getAllMessage: getAllMessage,
    seenMessage: seenMessage,
    getNotSeenMessage: getNotSeenMessage,
};
