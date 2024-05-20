import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { time } from "console";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    console.log("credentials are",credentials.email);
                    
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.identifier }
                        ]
                    })
                    console.log("user is",user)
                    if (!user) {
                        throw new Error("No user find with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account first")
                    }


                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect)
                        return user
                    else
                        throw new Error("Password is incorrect")
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({session,token}){
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            
            }
            return session;
        }

    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy:"jwt",
    },
    secret: process.env.NEXTAUTH_SECRET

}