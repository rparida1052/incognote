import { Message } from "@/model/message.model";

export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessage?:boolean;
    messages?:Array<Message> 
}