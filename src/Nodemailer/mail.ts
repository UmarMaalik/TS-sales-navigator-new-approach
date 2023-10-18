const nodemailer =require('nodemailer');
export async function Mailto(body:string,attach:boolean,path?:string){
    try{
  const transporter = nodemailer.createTransport({
   service:"gmail",
    auth: {
        user: 'umar.maalik@codeupscale.com',
        pass: 'yaim tapx bdtr nhbl'
    }
});

const mail = await transporter.sendMail({
  from: '"Sale navigator" <umerbinmaalik@gmail.com>', // sender address
  to: "umermaalik44@gmail.com", // list of receivers
  subject: "this is a test", // Subject line
  html:body, // html body
  attachments:attach?[{
    name:"ok1.xlsx",
    path:path 
  }]:null
});
    }catch(error){
        console.log("error from mail.ts error sending email",error)
    }

}