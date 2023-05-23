import { Router } from "express";
import Manager from "../DAO/Manager.MongoDB/ProductManager.js";


const router = Router()


router.get('/', async (req,res)=>{ 
    
    const products = await Manager.getProducts()
    res.render('home',{products:products}) 

})

router.get('/realtimeproducts',async (req,res)=>{
    
    const products = await Manager.getProducts()
    res.render('realTimeProducts',{products:products})
}) 

export default router