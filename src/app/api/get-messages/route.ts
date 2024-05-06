import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/user.model";


export async function GET(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized user"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user?._id);
    try {
        const user = await UserModel.aggregate([
            {$match:{id: userId}},
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group:{_id: '$_id', messages: {$push: '$messages'}}},
        ]);

        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 404})
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, {status: 200})
    } catch (error) {
        console.log("Failed to get messages", error);
        return Response.json({
            success: false,
            message: "Failed to get messages"
        }, {status: 500})
        
    }
}