import { Router } from "express";
import { generateProduct, passportCall } from "../utils.js";
import { realTimeProducts, renderCart, renderPaginatedProducts, renderProducts } from "../controllers/views.controller.js";


const router = Router()


router.get('/', renderProducts)

router.get('/realtimeproducts', realTimeProducts)

router.get('/products', passportCall('current') ,renderPaginatedProducts)

router.get('/carts/:cid', renderCart)

router.get('/mockingproducts', async(req,res)=>{
    const products = []
    for (let index = 0; index < 100; index++) {
        products.push(generateProduct())
    }
    res.send({ status: 'success', payload: products })
})

export default router