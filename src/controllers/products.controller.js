import { io } from "socket.io-client"
import { productService } from "../repository/index.js";

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
            const product = req.body
            let {title,description,code,price,status,stock,category,thumbnails} = product

            if((!title || !description || !price || !thumbnails || !code || !stock || !status || !category )){
                return res.status(400).send({
                    status: 'error',
                    message: 'producto no agregado: Faltan datos en las propiedades'
                })
            }
            
            let action = await productService.addProduct(product)

        //---------------RESPUESTA-------------------
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
            
            const action = await productService.deleteProduct(pid)

        //---------------RESPUESTA-------------------
            if(action===false){
                return res.status(404).send({
                    status: 'error',
                    message: 'producto no existe'
                })
            }

            socket.emit('change' , await productService.getProducts())
            return res.status(200).send({
                status: 'success',
                message: 'producto eliminado con exito'
            })
}