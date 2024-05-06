import mongoose from "mongoose";

type ConnectionOnject = {
    isConnected?: number
}

const connection:ConnectionOnject = {}

async function dbConnect():Promise<void>{

    if(connection.isConnected){
        console.log("Alredy connected to database");
        return;
    }
    try {
        const db  =await mongoose.connect(process.env.MONGODB_URI || '')
        console.log(db);

        connection.isConnected =  db.connections[0].readyState
        console.log("DB conncted successfully");               
    } catch (error) {
        console.log("Database connection failed",error);
        process.exit();
    }
}

export default dbConnect;