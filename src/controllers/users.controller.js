import { passwordService, userService } from "../repository/index.js";
import { generateTokens, createHash} from "../utils.js";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
    dotenv.config()


// CONTROLLER (GET) PARA CAMBIAR EL ROL DE USUARIO
    export const changeUserRol = async (req,res)=>async (req,res)=>{
        const uId = req.params.uid

        const user = await userService.getUser({_id:uId})

        if(user[0].rol == 'premium'){
            await userService.updateUser(uId,{rol:'user'})
            return res.status(200).send({status: 'success', message: 'Usuario modificado con exito de premium a user'})
        }
        if(user[0].rol == 'user'){
            await userService.updateUser(uId,{rol:'premium'})
            return res.status(200).send({status: 'success', message: 'Usuario modificado con exito de user a premium'})
        }

        return res.status(400).send({status:'error', message:'Los admin no se puden modificar'})
    }

// CONTROLLER (POST) PARA ENVIAR EL CORREO PARA REESTABLECER LA CONTRASEÑA
    export const sendMailForgetPassword = async (req,res)=>{
    
        const email= req.body.email
        const user = await userService.getUser({email:email})
    
        if(user==''){
            return res.status(400).json({status:'error', error:'user not found'})
        }
        const token = generateTokens(16)
        await passwordService.saveUserPassword({email,token})
        const mailerConfig = {
            service: 'gmail',
            auth:{user: process.env.MAILER_USER, pass:process.env.MAILER_PASSWORD }
        }
    
        let transporter = nodemailer.createTransport(mailerConfig)
        let messsage ={
            from:process.env.MAILER_USER,
            to:email,
            subject:'Reestablecimiento de contraseña',
            html: `<h1>Reestablecer tu contraseña</h1><a href='http://localhost:8080/api/users/reset-password/${token}'>clickeando aqui</a>`
        }
    
        try {
            await transporter.sendMail(messsage)
            res.json({status:'success', message:'Se envio el mail correctamente'})
        } catch (error) {
            res.status(500).json({status: 'error', error: error.message})
        }
    }

// CONTROLLER (GET) PARA REDIRIGIR A LA VISTA PARA VERIFICAR EL TOKEN
    export const redirectVerifyToken = async (req,res)=> {
        return res.redirect(`/verify-token/${req.params.token}`)
    }

// CONTROLLER (POST) PARA REESTABLECER LA CONTRASEÑA
    export const resetPassword = async (req,res)=>{
    
        try {

            const user = await userService.getUser({email:req.params.user})
            await userService.updateUser({_id:user[0]._id},{password: createHash(req.body.newPassword)})
            await passwordService.deleteUserPassword({email:req.params.user})
            res.json({status:'success', message:'Se ha creado la nueva contraseña correctamente'})

        } catch (error) {
            res.status(500).json({status: 'error', error: error.message})
        }
    }