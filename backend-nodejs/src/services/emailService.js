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
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin Chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email thì đã đặt lịch khám bệnh online trên Website thành công</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>
         <div>Xin chân thành cảm ơn</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>If you receive an email, you have successfully 
        booked an online medical appointment on the Website</p>
         <p>bla bla</p>
         <div>Xin chân thành cảm ơn</div>
        `
    }
    return result;
}
let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                from: '"Huu Tri Dev 👻" <nguyenhuutri0905@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả khám bệnh", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend), // html body
                attachments: [{
                    filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                    content: dataSend.imgBase64.split("base64,")[1],
                    encoding: 'base64'
                }],
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
}