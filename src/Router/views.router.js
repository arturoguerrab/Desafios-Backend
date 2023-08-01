import { Router } from "express";
import { generateProduct, passportCall } from "../utils.js";
import { realTimeProducts, renderCart, renderPaginatedProducts, renderProducts } from "../controllers/views.controller.js";
import logger from "../logger/logger.js";



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

router.get('/loggertest', (req, res) => {

    logger.debug('Prueba debug logger')
    logger.http('Prueba http logger')
    logger.info('Prueba info logger')
    logger.warning('Prueba warning logger')
    logger.error('Prueba error logger')
    logger.fatal('Prueba fatal logger')

    res.json({ status: 'success' })
})

export default router