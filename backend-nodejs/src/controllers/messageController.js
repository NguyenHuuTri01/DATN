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

module.exports = {
    sendMessage: sendMessage,
};
