import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
) : Promise<ApiResponse>{
   
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Incognote message | verification  mail',
            react: VerificationEmail({username:username,otp:verifyCode}),
          });
        return{success:true,message:"Verificatiion email send successfully"}
    } catch (emailError) {
        console.log("Error in sending verification Email",emailError);
        return{success:false,message:"failed to send verificatiion email"}
        
    }
}