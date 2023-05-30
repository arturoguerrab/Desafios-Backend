import { Router } from "express";
import Manager from "../DAO/Manager.MongoDB/ProductManager.js";
import productsModel from "../DAO/Models/products.model.js";
import mongoose from "mongoose";
import CManager from "../DAO/Manager.MongoDB/CartManager.js";


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

    await connectDB()
    let products = await productsModel.paginate({},{limit:2,page,lean:true})
    products.prevLink= products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}`:'',
    products.nextLink= products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}`:'',

    res.render('products',{products:products})
    await mongoose.connection.close()

})

router.get('/carts/:cid', async (req,res)=>{ 
    let cid =parseInt (req.params.cid)

    await connectDB()

    let cart = await CManager.GetCartById(cid)

    if(cart ==null){
        await mongoose.connection.close()
        return res.status(404).send({
            status: 'error',
            message: 'carrito no existente'
        })
    }
    let products = cart.products

    res.render('cart',{products:products,cid:cid})

    await mongoose.connection.close()
})

export default router