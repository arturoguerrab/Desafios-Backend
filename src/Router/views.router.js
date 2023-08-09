import { Router } from "express";
import { AdminPass, generateProduct, passportCall } from "../utils.js";
import { realTimeProducts, renderCart, renderCreateProduct, renderDeleteProduct, renderPaginatedProducts, renderProducts } from "../controllers/views.controller.js";
import logger from "../logger/logger.js";
import { userService } from "../repository/index.js";



const router = Router()


router.get('/', renderProducts)

router.get('/realtimeproducts', realTimeProducts)

router.get('/products', passportCall('current') ,renderPaginatedProducts)

router.get('/carts/:cid', renderCart)

router.get('/createproduct',AdminPass('current'), renderCreateProduct)

router.get('/deleteproduct',AdminPass('current'), renderDeleteProduct)

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

router.get('/api/users/premium/:uid', async (req,res)=>{
    const uId = req.params.uid

    const user = await userService.getUser({_id:uId})

    if(user[0].rol == 'premium'){
        await userService.updateUser(uId,{rol:'user'})
        return res.status(200).send({status: 'success', message: 'Usuario modificado con exito de premium a user'})
    }
    if(user[0].rol == 'user'){
        await userService.updateUser(uId,{rol:'premium'})
        return res.status(200).send({status: 'success', message: 'Usuario modificado con exito de user a premium'})
    }

    return res.status(400).send({status:'error', message:'Los admin no se puden modificar'})


}
)

export default router