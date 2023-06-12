import { Router } from "express";
import Manager from "../DAO/Manager.MongoDB/ProductManager.js";
import productsModel from "../DAO/Models/products.model.js";
import CManager from "../DAO/Manager.MongoDB/CartManager.js";


const router = Router()


router.get('/', async (req,res)=>{ 
    
    const products = await Manager.getProducts()
    res.render('home',{products:products}) 

})

router.get('/realtimeproducts',async (req,res)=>{
    
    const products = await Manager.getProducts()
    res.render('realTimeProducts',{products:products})
})

router.get('/products', async (req,res)=>{ 
    let page =req.query.page || 1

    if(isNaN(page) || page <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad page debe ser un numero mayor o igual a 0'
        })
    }

    
    let products = await productsModel.paginate({},{limit:2,page,lean:true})
    products.prevLink= products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}`:''
    products.nextLink= products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}`:''

    if (req.session.user){
        return res.render('products',{products:products, user:req.session.user})
    }

    res.render('errors/login_error')

    

})

router.get('/carts/:cid', async (req,res)=>{ 
    let cid =parseInt (req.params.cid)

    

    let cart = await CManager.GetCartById(cid)

    if(cart ==null){
        
        return res.status(404).send({
            status: 'error',
            message: 'carrito no existente'
        })
    }
    let products = cart.products

    res.render('cart',{products:products,cid:cid})

    
})

export default router