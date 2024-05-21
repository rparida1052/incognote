import mongoose,{Schema,Document} from "mongoose";
import { Message, MessageSchema } from "./message.model";

export interface User extends Document {
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessages:boolean;
    messages:Message[]
}

const UserSchema :Schema<User> = new Schema({
    username:{
        type:String,
        unique:true,
        trim:true,
        // required:[true,"User name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/.+\@.+\..+/,'Please Enter a valid Email']
    },
    password:{
        type:String,
        required:[true,'password is required'],
    },
    verifyCode:{
        type:String,
        required:[true,"Verify code is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code Expiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model("User",UserSchema)

export default UserModel;