
import messagesModel from "../Models/messages.model.js";


class MessagesManager{

    newMessage = async (message) => {

        

        const newMessage = new messagesModel({user:message.user, message:message.messages})
        await newMessage.save()
        
        return true


    }

    getHistorial = async()=>{
        

        const getAll = await messagesModel.find().lean().exec()

        if(getAll != ''){
            
            return getAll
        }

        
        return false
    }
}

const Manager = new MessagesManager()

export default Manager