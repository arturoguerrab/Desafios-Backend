
import { io } from "socket.io-client"
import { messagesService } from "../repository/index.js";

// CONTROLLER (GET) PARA RENDERIZAR TODOS LOS MENSAJES
    export const renderMessages = async (req,res)=>{ 
        //---------------LOGICA----------------------
            const historial= await messagesService.getHistorial()
        //---------------RESPUESTA-------------------
            return res.render('messages',{historial}) 
    
    }

// CONTROLLER (POST) PARA CREAR UN NUEVO MENSAJE
    export const SendMessage = async (req,res)=>{ 
        //---------------LOGICA----------------------
            const socket= io('http://localhost:8080')
            const message =req.body
            await messagesService.newMessage(message)
            socket.emit('send' , await messagesService.getHistorial())
        //---------------RESPUESTA-------------------
            return res.redirect("/chat")
    
    }