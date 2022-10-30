const nodeMailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

exports.sendEmail= async options => {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const handlebarOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: './views/',
            defaultLayout: false,
        },
        viewPath: './views/',
        extName: '.handlebars',
    }

    transporter.use('compile', hbs(handlebarOptions))

    return transporter.sendMail( options)
    .then((info) => {
        console.log('Email terkirim: %s', info.messageId)
    })
    .catch((err) => {
        console.log(err)
    })
}