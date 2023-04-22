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

module.exports = {
    createOrder: createOrder,
};
