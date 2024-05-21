import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/message.model";
import UserModel from "@/model/user.model";


export async function POST(request: Request) {
    await dbConnect();
    const {username, content} = await request.json();
    try{
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }
        //check if the user is accepting messages
        if(!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, {status: 403})
        }
        const message = {content,createdAt:new Date()};
        user.messages.push(message as Message); // message as Message : Type assertion to avoid type error 
        await user.save();
        return Response.json({ 
            success: true,
            message: "Message sent successfully"
        }, {status: 200})
    }catch(error){

    }
}