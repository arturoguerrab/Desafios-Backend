import { io } from "socket.io-client"
import { productService, userService } from "../repository/index.js";
import CustomError from "../public/js/custom_errors.js";
import { generateErrorInfo} from "../public/js/info.js";
import EErros from "../public/js/enums.js";
import logger from "../logger/logger.js";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

// CONTROLLER (GET) PARA TRAER TODOS LOS PRODUCTOS
    export const getProducts = async(req,res)=> {

        //---------------LOGICA----------------------
            const limit = req.query.limit || 10
            const page = req.query.page || 1
            const query = req.query.query || ''
            const sort = req.query.sort || ''
            
            const productos = await productService.getProductsPaginate({query,limit,page,sort})

            if(isNaN(limit) || limit <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'la propiedad limit debe ser un numero mayor o igual a 0'
                })
            }
            
            if(productos===false){
                return res.status(404).send({
                    status: 'error',
                    message: 'productos esta vacio, intenta agregar un nuevo producto'
                })
            }

        //---------------RESPUESTA----------------------
            return res.status(200).send({
                status:'success',
                payload: productos.docs,
                totalPages: productos.totalPages,
                prevPage: productos.prevPage,
                nextPage: productos.nextPage,
                page:productos.page,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevLink: productos.hasPrevPage==false ? null : `http://localhost:8080/api/products?limit=${limit}&page=${productos.page-1}&query=${query}&sort=${sort}`,
                nextLink: productos.hasNextPage==false ? null : `http://localhost:8080/api/products?limit=${limit}&page=${productos.page+1}&query=${query}&sort=${sort}`,
            })
    }

// CONTROLLER (GET) PARA TRAER PRODUCTOS POR SU ID
    export const getProductsByID  = async (req,res)=> {

        //---------------LOGICA----------------------
            const pid = req.params.pid

            const producto = await productService.getProducts({_id:pid})

            if(producto===false){
                return res.status(404).send({
                    status: 'error',
                    message: 'producto no existe'
                })
            }

        //---------------RESPUESTA-------------------
            return res.status(200).send({
                status: 'success',
                payload: producto
            })
    }

// CONTROLLER (POST) PARA CREAR UN NUEVO PRODUCTO
    export const postProduct = async (req,res) => {

        //---------------LOGICA----------------------
            const socket= io('http://localhost:8080')
            let product = req.body
            let {title,description,code,price,stock,category,thumbnails} = product

            if((!title || !description || !price || !thumbnails || !code || !stock || !category )){
                CustomError.createError({
                    name: "User creation error",
                    cause: generateErrorInfo(),
                    message: "Error trying to create a user",
                    code: EErros.INVALID_TYPES_ERROR
                })
                
                // return res.status(400).send({
                //     status: 'error',
                //     message: 'producto no agregado: Faltan datos en las propiedades'
                // })
            }

            if(req.user.user.rol == 'admin' || req.user.user.rol == 'premium'){

                product.owner=req.user.user.email
                
                let action = await productService.addProduct(product)

                if(action===true){
                    socket.emit('change' , await productService.getProducts())
    
                    return res.status(201).send({
                        status: 'success',
                        message: 'producto agregado con exito'
                    })
                }
                
                return res.status(400).send({
                    status: 'error',
                    message: 'producto no agregado: Propiedad <Code> en el Producto esta repetida'
                })
            }

            return res.status(400).send({
                status: 'error',
                message: 'producto no agregado: Usted debe ser premium o admin'
            })

        //---------------RESPUESTA-------------------
        

    }

// CONTROLLER (PUT) PARA TRAER ACTUALIZAR UN PRODUCTO POR SU ID
    export const updateProduct= async (req,res) => {

        //---------------LOGICA----------------------
            const socket= io('http://localhost:8080')
            const pid = req.params.pid
            const product = req.body
            
            if(product._id || product.code){
                return res.status(400).send({
                    status: 'error',
                    message: 'No se puede modificar el id o el code del producto'
                })
            }

            let action = await productService.updateProduct(pid,product)

        //---------------RESPUESTA-------------------
            if(action===false){
                return res.status(404).send({
                    status: 'error',
                    message: 'producto no existe'
                })}

            socket.emit('change' , await productService.getProducts())
            return res.status(201).send({
                status: 'success',
                message: 'producto modificado con exito'
            })
    }

// CONTROLLER (DELETE) PARA ELIMINAR UN PRODUCTO POR SU ID
    export const deleteProduct = async (req,res) => {

        //---------------LOGICA----------------------
            const socket= io('http://localhost:8080')
            const pid = req.params.pid
            console.log(pid);
            let action

            if(req.user.user.rol == 'admin'){
                action = await productService.deleteProduct(pid)
                let product = await productService.getProducts({_id:pid})
                let user = await userService.getUser({email:product[0].owner})
                if(user[0].rol == 'premium'){
                    const mailerConfig = {
                        service: 'gmail',
                        auth:{user: process.env.MAILER_USER, pass:process.env.MAILER_PASSWORD }
                    }
                
                    let transporter = nodemailer.createTransport(mailerConfig)
                    let messsage ={
                        from:process.env.MAILER_USER,
                        to:user[0].email,
                        subject:'Se elimino tu Producto',
                        html: `<h1>AVISO - SE ELIMINO TU PRODUCTO</h1><p>Se elimino el producto ${product[0].title}</p>`
                    }
                
                    try {
                        await transporter.sendMail(messsage)
                    } catch (error) {
                        res.status(500).json({status: 'error', error: error.message})
                    }
                }
                
            }

            if(req.user.user.rol == 'premium'){
                let product = await productService.getProducts({_id:pid})
                action = false
                if (product[0].owner == req.user.user.email){
                    action = await productService.deleteProduct(pid)
                    let user = await userService.getUser({email:product[0].owner})
                    if(user[0].rol == 'premium'){
                        const mailerConfig = {
                            service: 'gmail',
                            auth:{user: process.env.MAILER_USER, pass:process.env.MAILER_PASSWORD }
                        }
                    
                        let transporter = nodemailer.createTransport(mailerConfig)
                        let messsage ={
                            from:process.env.MAILER_USER,
                            to:user[0].email,
                            subject:'Se elimino tu Producto',
                            html: `<h1>AVISO - SE ELIMINO TU PRODUCTO</h1><p>Se elimino el prodcuto ${product[0].title}</p>`
                        }
                    
                        try {
                            await transporter.sendMail(messsage)
                        } catch (error) {
                            res.status(500).json({status: 'error', error: error.message})
                        }
                    }
                }
            }

        //---------------RESPUESTA-------------------
            if(action===false){
                return res.status(404).send({
                    status: 'error',
                    message: 'producto no existe o no es el owner'
                })
            }

            socket.emit('change' , await productService.getProducts())
            return res.status(200).send({
                status: 'success',
                message: 'producto eliminado con exito'
            })
}