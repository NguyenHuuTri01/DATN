import nodemailer from 'nodemailer'
require('dotenv').config();

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '<nguyenhuutri0905@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Xác nhận tạo tài khoản", // Subject line
        html: getBodyHTMLEmail(dataSend), // html body
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    result = `
         <p>
         Nhấn đường link bên dưới để hoàn tất việc tạo tài khoản
         </p>
         <div>
         <a href=${dataSend.redirectLink} target = "_blank">Click here</a>
         </div>
        `
    return result;
}

let sendAcceptOrder = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '<nguyenhuutri0905@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Xác Nhận Đặt Hàng", // Subject line
        html: getBodyAcceptOrder(dataSend), // html body
    });
}
let getBodyAcceptOrder = (dataSend) => {
    let result = ''
    result = `
        <p>
         Anh/Chị ${dataSend.userName} đã đặt hàng bên chúng tôi với mã đơn hàng ${dataSend.transactionId}, 
         vui lòng nhấn vào đường link bên dưới để hoàn tất việc đặt hàng:
         </p>
         <p>
         Nhấn đường link bên dưới để hoàn tất việc tạo tài khoản
         </p>
         <div>
         <a href=${dataSend.redirectLink} target = "_blank">Click here</a>
         </div>
        `
    return result;
}


module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAcceptOrder: sendAcceptOrder,
}