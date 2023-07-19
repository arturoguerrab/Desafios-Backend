import { cartsService } from "../repository/index.js";

// CONTROLLER (POST) PARA CREAR UN NUEVO CARRITO
    export const createCart= async (req,res) => {
        //---------------LOGICA----------------------
            cartsService.CreateCart()

        //---------------RESPUESTA-------------------
            return res.status(201).send({
                status: 'success',
                message: 'nuevo carrito creado con exito'
            })
        
    }

// CONTROLLER (GET) PARA TRAER EL CARRITO POR SU ID
    export const getCartByID = async (req,res)=> {

        //---------------LOGICA----------------------
            const cid = req.params.cid
            const carrito = await cartsService.GetCarts({_id:cid})

        //---------------RESPUESTA-------------------
            if(carrito==false){
                return res.status(404).send({
                    status: 'error',
                    message: `Carrito ${cid} no existe`
                })
            }

            return res.status(200).send({
                status:'success',
                payload: carrito
            })
    }

// CONTROLLER (POST) PARA AGREGAR UN PRODUCTO AL CARRITO
    export const addToCartByID = async (req,res) => {

        //---------------LOGICA----------------------
            const cid = req.params.cid
            const pid = req.params.pid
            
            let action = await cartsService.AddToCart(cid,pid)
        
        //---------------RESPUESTA-------------------
            if(action===false){
                return res.status(404).send({
                    status: 'error',
                    message: `carrito ${cid} o producto ${pid} no existe`
                })
            }

            return res.status(201).send({
                status: 'success',
                message: 'Producto agregado al carrito con exito'
            })
    }

// CONTROLLER (DELETE) PARA ELIMINAR UN PRODUCTO EN EL CARRITO
    export const deleteProductInCart = async (req,res) => {

        //---------------LOGICA----------------------
            const pid = req.params.pid
            const cid = req.params.cid
            
            const action = await cartsService.DeleteProduct(cid,pid)

        //---------------RESPUESTA-------------------
            if(action===false){
                return res.status(404).send({
                    status: 'error',
                    message: 'producto o carrito no existe'
                })
            }

            return res.status(200).send({
                status: 'success',
                message: 'producto eliminado con exito'
            })
    }

// CONTROLLER (DELETE) PARA ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO
    export const deleteAllProducts = async (req,res) => {

        //---------------LOGICA----------------------
            const cid = req.params.cid
            
            const action = await cartsService.DeleteAllProducts(cid)

        //---------------RESPUESTA-------------------
            if(action===false){
                return res.status(404).send({
                    status: 'error',
                    message: 'producto o carrito no existe'
                })
            }
            
            return res.status(200).send({
                status: 'success',
                message: 'productos eliminados con exito'
            })
    }

// CONTROLLER (PUT) PARA MODIFICAR TODO EL CARRITO
    export const UpdateAllCart = async (req,res) => {

        //---------------LOGICA----------------------
            const cid = req.params.cid
            const products = req.body

            let action = await cartsService.UpdateCart(cid,products)
            
        //---------------RESPUESTA-------------------
            if(action===false){
                return res.status(404).send({
                    status: 'error',
                    message: 'error en actualizar'
                })}

            return res.status(201).send({
                status: 'success',
                message: 'productos actualizados con exito'
            })

    }

// CONTROLLER (PUT) PARA ACTUALIZAR LA CANTIDAD DE UN PRODUCTO
    export const UpdateProductQty = async (req,res) => {

        //---------------LOGICA----------------------
            const cid = req.params.cid
            const pid = req.params.pid
            const qty = req.body

            let action = await cartsService.UpdateProductQuantity(cid,pid,qty.quantity)

        //---------------RESPUESTA-------------------
            if(action===false){
                return res.status(404).send({
                    status: 'error',
                    message: 'error en actualizar'
                })}

            return res.status(201).send({
                status: 'success',
                message: 'producto actualizado con exito'
            })

    }