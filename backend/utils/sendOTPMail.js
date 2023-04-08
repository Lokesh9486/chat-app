const nodemailer=require("nodemailer");

const sendEmail=async options=>{
    const transport={
        service:"hotmail",
        auth:{
            user:"",
            password:""
        }
    }
    const transporter=nodemailer.createTransport(transport);
     
    const mailOptions={
        from:"",
        to:options.email,
        subject:"sending email with node.js",
        text:"texting peropse"
    }
    transporter.sendMail(mailOptions,function(err,info){
        if(err){
            console.log(err);
            return;
        }
        else{
            console.log(`Sent ${info.response}`);
        }
    })
}

module.exports=sendEmail;