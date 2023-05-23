import { Router } from "express";
import Manager from "../DAO/Manager.MongoDB/messagesManager.js";



const router = Router()


router.get('/', async (req,res)=>{ 
    const historial= await Manager.getHistorial()
    res.render('messages',{historial}) 

})

router.post('/', async (req,res)=>{ 
    const message =req.body
    console.log(message)
    await Manager.newMessage(message)

})

export default router