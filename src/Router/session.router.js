import { Router } from "express";
import userModel from "../DAO/Models/user.model.js";
import mongoose from "mongoose";

const router = Router()

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

router.get('/register', (req, res)=>{
    res.render('sessions/register')
})

router.post('/register', async (req, res)=>{
    await connectDB()
    const userNew = req.body
    const duplicatedUser = await userModel.findOne({email: userNew.email}).lean().exec()
    if(duplicatedUser){
        return res.render('errors/register_error')
    }
    const user = new userModel(userNew)
    await user.save()
    await mongoose.connection.close()
    res.redirect('/session/login')
})

router.get('/login', (req, res)=>{
    res.render('sessions/login')
})

router.post('/login', async (req, res)=>{
    await connectDB()
    const {email,password} = req.body
    const user = await userModel.findOne({ $and:[ {email: email}, {password:password}]}).lean().exec()


    if(!user){
        return res.status(401).render('errors/base',{error: 'Error en Email o Contraseña'})
    }
    req.session.user = {first_name: user.first_name, last_name: user.last_name, rol:user.rol}
    await mongoose.connection.close()
    res.redirect('/products')
})

router.get('/logout', async (req, res)=>{
    req.session.destroy(err =>{
        if (err) {
            res.status(500).render('errors/base', {error: err})
        }else{
            res.redirect('/session/login')
        }
    })
})

export default router