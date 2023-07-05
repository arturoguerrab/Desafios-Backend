import Manager from "../DAO/Manager.MongoDB/messagesManager.js";

// CONTROLLER (GET) PARA RENDERIZAR TODOS LOS MENSAJES
    export const renderMessages = async (req,res)=>{ 
        //---------------LOGICA----------------------
            const historial= await Manager.getHistorial()

        //---------------RESPUESTA-------------------
            return res.render('messages',{historial}) 
    
    }

// CONTROLLER (POST) PARA CREAR UN NUEVO MENSAJE
    export const SendMessage = async (req,res)=>{ 
        //---------------LOGICA----------------------
            const message =req.body
            await Manager.newMessage(message)
        //---------------RESPUESTA-------------------
            return res.redirect("/chat")
    
    }