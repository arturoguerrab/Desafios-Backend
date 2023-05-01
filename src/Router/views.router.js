import { Router } from "express";
import Manager from "../Manager/ProductManager.js";
const products = Manager.getProducts()

const router = Router()


router.get('/', (req,res)=> res.render('home',{products:products}))

router.get('/realtimeproducts', (req,res)=> res.render('realTimeProducts',{products:products}))

export default router