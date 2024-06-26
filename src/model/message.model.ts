import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date
}

 export const MessageSchema : Schema<Message> = new Schema({
    content:{
        type:String,
        required:[true,"Message is required"]
    },
    createdAt:{
        type:Date,
    }
})