import { BrevoClient } from "@getbrevo/brevo"
import dotenv from "dotenv"
dotenv.config()
export const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});
export const sendSignupOtpEmail=async(otp,email) =>{
    try{
        const res= await brevo.transactionalEmails.sendTransacEmail({
            subject:"aaa",
            textContent:"abd",
            htmlContent:`<h3>Your OTP is ${otp}</h3>`,
            sender:{
                name:"aaa",
                email:"sakshi.rautela@appfoster.com"
            },to:[
                {email:email,
            name:"abx"}
            ]
        });
        return await {res}
    }catch(error){
        return await {error}
    }
}
export const sendForgetOtpEmail=async(otp,email) =>{
    try{
        const res=brevo.transactionalEmails.sendTransacEmail({
            subject:"aaa",
            textContent:"abd",
            htmlContent:`<h3>Your OTP is ${otp}</h3>`,
            sender:{
                name:"aaa",
                email:"sakshi.rautela@appfoster.com"
            },to:[
                {email:email,
            name:"abx"}
            ]
        });
        return await {res}
    }catch(error){
        return await {error}
    }
}
