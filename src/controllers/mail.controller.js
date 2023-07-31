import nodemailer from "nodemailer";
import __dirname from "../utils.js";
import configMailSms from "../configmailsms.js";


/////////////////////////////////////////////////////////////////////////////
const {
    nodemailerConfig: { service, port, user, password,mail_receptor},
  } = configMailSms;

//////////////////////////////////////////////////////////////

const transport = nodemailer.createTransport({
    service: service,
    port: port,
    auth: {
        user: user,
        pass: password
    },
    tls: {
        rejectUnauthorized: false
    }
});
/////////////////////////////////////////////////////////////////////
export async function sendEmail(req,res){
    try {
        req.logger.debug('Entro al sendEmail');
    const email=req.session.user.email;

       let result = await transport.sendMail({
        from: user,      
        to: email,      
        subject: "Test mail hector",
        html: `
        <h1>This is a testing mail</h1>
        `,
        attachments: [{
            filename: 'aguasaborizada.jpg',
            path: `${__dirname}/public/images/aguasaborizada.jpg`,
            cid: 'miemail',
        }]
    });
   
 return res.send({ status: "success", result: "mail sent" });
 
   
} catch (error) {
    res.status(500).json({ error: error.message });
  };
};


