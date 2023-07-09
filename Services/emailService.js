const nodeMailer=require('nodemailer')
// If we are accepting html then text will be ignored

// require('dotenv')

async function sendMail({from, to, subject, text, html}){

// var smtpConfig={
//     host:process.env.SMTP_POST,
//         port:process.env.SMTP_PORT,
//         secure:false,
//         auth:{
//             user:process.env.MAIL_USER,
//             pass:process.env.MAIL_PASS
//         }
// }

    const transporter=nodeMailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    });
    // const transporter=nodeMailer.createTransport(smtpConfig);

    // transporter.verify((err, success) => {
    //     if (err) console.error(err);
    //     console.log('Your config is correct');
    // });

    // console.log(transporter.options.host);

    let info=await transporter.sendMail({
        from:`ShareTo <${from}>`,
        to:to,
        subject:subject,
        text:text,
        html:html
    })

    // console.log(info);
}

module.exports=sendMail;