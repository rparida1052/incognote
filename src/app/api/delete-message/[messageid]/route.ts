import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/model/user.model";


export async function DELETE(
    request: Request,
    { params }: { params: { messageid: string } }
) {
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    try {
        const updatedResult = await UserModel.updateOne(
            { _id: _user._id },
            { $pull: { messages: messageId } }
        );

        if (updatedResult.modifiedCount === 0) {
            return Response.json(
                { success: false, message: 'Failed to delete message' },
                { status: 404 }
            );
        }

        return Response.json(
            { message: 'Message deleted', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return Response.json(
            { message: 'Error deleting message', success: false },
            { status: 500 }
        );
    }
}