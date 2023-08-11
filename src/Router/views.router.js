import { Router } from "express";
import { AdminPass, createHash, generateProduct, generateTokens, passportCall } from "../utils.js";
import { realTimeProducts, renderCart, renderCreateProduct, renderDeleteProduct, renderPaginatedProducts, renderProducts } from "../controllers/views.controller.js";
import logger from "../logger/logger.js";
import { passwordService, userService } from "../repository/index.js";
import dotenv from 'dotenv'
    dotenv.config()

import nodemailer from 'nodemailer'


const router = Router()


router.get('/', renderProducts)

router.get('/realtimeproducts', realTimeProducts)

router.get('/products', passportCall('current') ,renderPaginatedProducts)

router.get('/carts/:cid', renderCart)

router.get('/createproduct',AdminPass('current'), renderCreateProduct)

router.get('/deleteproduct',AdminPass('current'), renderDeleteProduct)

router.get('/mockingproducts', async(req,res)=>{
    const products = []
    for (let index = 0; index < 100; index++) {
        products.push(generateProduct())
    }
    res.send({ status: 'success', payload: products })
})

router.get('/loggertest', (req, res) => {

    logger.debug('Prueba debug logger')
    logger.http('Prueba http logger')
    logger.info('Prueba info logger')
    logger.warning('Prueba warning logger')
    logger.error('Prueba error logger')
    logger.fatal('Prueba fatal logger')

    res.json({ status: 'success' })
})

router.get('/api/users/premium/:uid', async (req,res)=>{
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
)

router.get('/forget-password', async (req,res)=>{
    
    return res.render('forgetPassword')


}
)

router.post('/forget-password', async (req,res)=>{
    
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
        html: `<h1>Reestablecer tu contraseña</h1><a href='http://localhost:8080/reset-password/${token}'>clickeando aqui</a>`
    }

    try {
        await transporter.sendMail(messsage)
        res.json({status:'success', message:'Se envio el mail correctamente'})
    } catch (error) {
        res.status(500).json({status: 'error', error: error.message})
    }
}
)

router.get('/reset-password/:token', async (req,res)=>{
    
    return res.redirect(`/api/sessions/verify-token/${req.params.token}`)


}
)

router.get('/api/sessions/verify-token/:token', async (req,res)=>{
    const userPassword = await passwordService.getUserPassword({token:req.params.token})

    if(userPassword == ''){
        return res.status(404).json({status:'error', message:'Token no valido / el token a expirado'})
    }

    const user = userPassword[0].email
    return res.render(`sessions/reset-password`,{user})


}
)

router.post('/reset-password/:user', async (req,res)=>{
    
    try {
        const user = await userService.getUser({email:req.params.user})
        console.log(req.params.user);
        await userService.updateUser({_id:user[0]._id},{password: createHash(req.body.newPassword)})
        await passwordService.deleteUserPassword({email:req.params.user})
        res.json({status:'success', message:'Se ha creado la nueva contraseña correctamente'})
    } catch (error) {
        res.status(500).json({status: 'error', error: error.message})
    }
}
)

export default router