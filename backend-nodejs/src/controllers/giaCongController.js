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



module.exports = {
    submitForm: submitForm,
    getGiaCong: getGiaCong,
};
