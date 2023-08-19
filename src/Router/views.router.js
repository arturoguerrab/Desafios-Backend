import { Router } from "express";
import { AdminPass, passportCall } from "../utils.js";
import { realTimeProducts, renderCart, renderCreateProduct, renderDeleteProduct, renderForgetPassword, renderPaginatedProducts, renderProducts, renderVerifyToken } from "../controllers/views.controller.js";


const router = Router()


router.get('/', renderProducts)

router.get('/realtimeproducts', realTimeProducts)

router.get('/products', passportCall('current') ,renderPaginatedProducts)

router.get('/carts/:cid', renderCart)

router.get('/createproduct',AdminPass('current'), renderCreateProduct)

router.get('/deleteproduct',AdminPass('current'), renderDeleteProduct)

router.get('/forget-password', renderForgetPassword)

router.get('/verify-token/:token', renderVerifyToken )


export default router