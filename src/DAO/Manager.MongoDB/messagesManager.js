import mongoose from "mongoose";
import messagesModel from "../Models/messages.model.js";

const url = "mongodb+srv://coderhouse:coderhouse@cluster-coderhouse.zdvxeq6.mongodb.net/ecommerce"

const connectDB = async()=>{

    mongoose.set("strictQuery",false)
    try {
        await mongoose.connect(url)
        
        console.log("DB Connected");
    }
    catch{
        console.log("No se puede conectar a la DB");
    }
}

class MessagesManager{

    newMessage = async (message) => {

        await connectDB()

        const newMessage = new messagesModel({user:message.user, message:message.messages})
        await newMessage.save()
        await mongoose.connection.close()
        return true


    }

    getHistorial = async()=>{
        await connectDB()

        const getAll = await messagesModel.find().lean().exec()

        if(getAll != ''){
            await mongoose.connection.close()
            return getAll
        }

        await mongoose.connection.close()
        return false
    }
}

const Manager = new MessagesManager()

export default Manager