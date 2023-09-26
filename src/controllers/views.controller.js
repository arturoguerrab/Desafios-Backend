
import { cartsService, productService, userService } from "../repository/index.js";
import { passwordService } from "../repository/index.js";

// CONTROLLER (GET) PARA RENDERIZAR TODOS LOS PRODUCTOS
    export const renderProducts = async (req,res)=>{ 

        //---------------LOGICA----------------------
            const products = await productService.getProducts()

        //---------------RESPUESTA-------------------
            return res.render('home',{products:products}) 

    }

// CONTROLLER (GET) PARA RENDERIZAR TODOS LOS PRODUCTOS EN TIEMPO REAL CON SOCKET
    export const realTimeProducts = async (req,res)=>{

        //---------------LOGICA----------------------
            const products = await productService.getProducts()

        //---------------RESPUESTA-------------------
            return res.render('realTimeProducts',{products:products})

    }

// CONTROLLER (GET) PARA RENDERIZAR TODOS LOS PRODUCTOS PAGINADOS
    export const renderPaginatedProducts = async (req,res)=>{ 

        //---------------LOGICA----------------------
            let page =req.query.page || 1

            if(isNaN(page) || page <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'la propiedad page debe ser un numero mayor o igual a 0'
                })
            }

            let products = await productService.getProductsPaginate({limit:2,page,lean:true})
            products.prevLink= products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}`:''
            products.nextLink= products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}`:''

        //---------------RESPUESTA-------------------
            return res.render('products',{products:products, user:req.user.user})

    }

// CONTROLLER (GET) PARA RENDERIZAR UN CARRITO Y SUS PRODUCTOS
    export const renderCart = async (req,res)=>{ 
        //---------------LOGICA----------------------
            let cid =req.params.cid
            let cart = await cartsService.GetCarts({_id:cid})
            if(cart == null){
                
                return res.status(404).send({
                    status: 'error',
                    message: 'carrito no existente'
                })
            }
            
            let products = cart[0].products
            

        //---------------RESPUESTA-------------------
            return res.render('cart',{products:products,cid:cid})
        
    }

// CONTROLLER (GET) PARA RENDERIZAR LA CREACION DE PRODUCTOS
    export const renderCreateProduct = async (req, res)=>{
        return res.render('createProduct')
    }

// CONTROLLER (GET) PARA RENDERIZAR ELIMINAR UN PRODUCTO
    export const renderDeleteProduct = async (req, res)=>{
        return res.render('deleteProduct')
    }

// CONTROLLER (GET) PARA RENDERIZAR FORGET PASSWORD 
    export const renderForgetPassword = async (req,res)=>{
        return res.render('forgetPassword')
    }

// CONTROLLER (GET) PARA RENDERIZAR VERIFICAR TOKEN
    export const renderVerifyToken = async (req,res)=>{

        const userPassword = await passwordService.getUserPassword({token:req.params.token})

        if(userPassword == ''){
            return res.status(404).json({status:'error', message:'Token no valido / el token a expirado'})
        }

        const user = userPassword[0].email
        return res.render(`sessions/reset-password`,{user})

}

// CONTROLLER (GET) PARA RENDERIZAR TODOS LOS PRODUCTOS EN TIEMPO REAL CON SOCKET
export const renderUsers = async (req,res)=>{

    //---------------LOGICA----------------------
        const users = await userService.getUser()

    //---------------RESPUESTA-------------------
        return res.render('users',{users:users})

}