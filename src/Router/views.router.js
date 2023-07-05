import { Router } from "express";
import { passportCall } from "../utils.js";
import { realTimeProducts, renderCart, renderPaginatedProducts, renderProducts } from "../controllers/views.controller.js";


const router = Router()


router.get('/', renderProducts)

router.get('/realtimeproducts', realTimeProducts)

router.get('/products', passportCall('current') ,renderPaginatedProducts)

router.get('/carts/:cid', renderCart)

export default router