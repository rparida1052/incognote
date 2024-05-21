import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user.model";


export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user = session?.user;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized user"
        }, { status: 401 })
    }

    const userId = user?._id;
    const { acceptingmessages } = await request.json();
    console.log("acceptingmessages", acceptingmessages);
    const isAcceptingMessage = acceptingmessages;
    try {

        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: isAcceptingMessage }, { new: true });
        console.log("updated use status is ",updatedUser);
        

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update the user status to accept the messaages"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "Messages acceptance status updated successfully"
        }, {
            status: 200
        })

    } catch (error) {
        console.log("Failed to update accepting messages status", error);
        return Response.json({
            success: false,
            message: "Failed to update accepting messages status"
        }, {
            status: 500
        })

    }
}

export async function GET(request: Request) { 
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user = session?.user;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized user"
        }, { status: 401 })
    }

    const userId = user?._id;
    try {
        const foundedUser = await UserModel.findById(userId);
        if (!foundedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundedUser.isAcceptingMessages,
            message: "User messages acceptance status fetched successfully"
        }, {
            status: 200
        })

    } catch (error) {
        console.log("Failed to fetch accepting messages status", error);
        return Response.json({
            success: false,
            message: "Failed to fetch accepting messages status"
        }, {
            status: 500
        })

    }
}