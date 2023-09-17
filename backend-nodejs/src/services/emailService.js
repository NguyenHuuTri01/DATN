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
         <div>
         <a href=${dataSend.redirectLink} target = "_blank">Click here</a>
         </div>
        `
    return result;
}

let sendForgotPassword = async (dataSend) => {
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
        subject: "Khôi Phục Mật Khẩu", // Subject line
        html: getBodyForgotPassword(dataSend), // html body
    });
}
let getBodyForgotPassword = (dataSend) => {
    let result = ''
    result = `
        <p>
         Có ai đó đang cố khôi phục mật khẩu, 
         nếu là bạn vui lòng nhấn vào đường link bên dưới để tiến hành khôi phục mật khẩu 
         </p>
         <p>
         Nếu không phải bạn đang tiến hành khôi phục thì bỏ qua email này và cải thiện mật khẩu để
         tăng cường bảo mật.
         </p>
         <div>
         <a href=${dataSend.redirectLink} target = "_blank">Click here</a>
         </div>
        `
    return result;
}

let sendNewPassword = async (dataSend) => {
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
        subject: "Khôi Phục Mật Khẩu", // Subject line
        html: getBodySendNewPassword(dataSend), // html body
    });
}
let getBodySendNewPassword = (dataSend) => {
    let result = ''
    result = `
        <p>
         Khôi phục mật khẩu thành công, tiến hành đăng nhập với mật khẩu là:
         ${dataSend.newPassword}
         </p>
        `
    return result;
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAcceptOrder: sendAcceptOrder,
    sendForgotPassword: sendForgotPassword,
    sendNewPassword: sendNewPassword,
}