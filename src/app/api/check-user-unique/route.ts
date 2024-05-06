import { z } from "zod";
import { usernameValdation } from "@/schemas/SignUpSchema"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

const UsernameQuerySchema = z.object({
    username: usernameValdation
})

export async function GET(request: Request) {

    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = { username: searchParams.get("username") }
        const result = UsernameQuerySchema.safeParse(queryParams);//safeParse is used to validate the query parameters using the schema 
        console.log(result); //TODO: Remove this line after checking
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invalid username"
            }, { status: 400 })
        }

        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Username is available"
        }, {
            status: 200
        })

    } catch (error) {
        console.log("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })

    }
}