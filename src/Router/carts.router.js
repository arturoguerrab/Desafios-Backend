import { Router } from "express";
import CManager from "../DAO/Manager.MongoDB/CartManager.js";

const router = Router()

router.post('/', async (req,res) => {
    
    CManager.CreateCart()
    
    res.status(201).send({
        status: 'success',
        message: 'nuevo carrito creado con exito'
    })
    }
    
)

router.get('/:cid', async (req,res)=> {
    const cid = req.params.cid

    if(isNaN(cid) || cid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad cid (Cart ID) debe ser un numero mayor o igual a 0'
        })
    }

    const carrito = await CManager.GetCartById(cid)

    if(carrito==false){
        return res.status(404).send({
            status: 'error',
            message: `Carrito ${cid} no existe`
        })
    }

    res.status(200).send({
        Cart: carrito})
})

router.post('/:cid/product/:pid', async (req,res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    if(isNaN(cid) || cid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'las propiedades pid (Product ID) y cid (Cart ID) deben ser un numero mayor o igual a 0'
        })
    }

    
    let action = await CManager.AddToCart(cid,pid)

    if(action===false){
        return res.status(404).send({
            status: 'error',
            message: `carrito ${cid} o producto ${pid} no existe`
        })
    }

    res.status(201).send({
        status: 'success',
        message: 'Producto agregado al carrito con exito'
    })
    }
    
)

router.delete('/:cid/products/:pid', async (req,res) => {

    const pid = req.params.pid
    const cid = req.params.cid
    
    if(isNaN(cid) || cid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'las propiedades pid (Product ID) y cid (Cart ID) deben ser un numero mayor a 0'
        })
    }
    
    const action = await CManager.DeleteProduct(cid,pid)

    if(action===false){
        return res.status(404).send({
            status: 'error',
            message: 'producto o carrito no existe'
        })
    }

    res.status(200).send({
        status: 'success',
        message: 'producto eliminado con exito'
    })
})

router.delete('/:cid', async (req,res) => {

    const cid = req.params.cid
    
    if(isNaN(cid) || cid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad cid (Cart ID) debe ser un numero mayor a 0'
        })
    }
    
    const action = await CManager.DeleteAllProducts(cid)

    if(action===false){
        return res.status(404).send({
            status: 'error',
            message: 'producto o carrito no existe'
        })
    }
    
    res.status(200).send({
        status: 'success',
        message: 'productos eliminados con exito'
    })
})

router.put('/:cid', async (req,res) => {
    
    const cid = req.params.cid
    const products = req.body
    

    if(isNaN(cid) || cid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad cid (Cart ID) debe ser un numero mayor o igual a 0'
        })
    }


    let action = await CManager.UpdateCart(cid,products)

    if(action===false){
        return res.status(404).send({
            status: 'error',
            message: 'error en actualizar'
        })}

    res.status(201).send({
        status: 'success',
        message: 'productos actualizados con exito'
    })

})

router.put('/:cid/products/:pid', async (req,res) => {
    
    const cid = req.params.cid
    const pid = req.params.pid
    const qty = req.body
    

    if(isNaN(cid) || cid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'las propiedades pid (Product ID) y cid (Cart ID) deben ser un numero mayor a 0'
        })
    }

    let action = await CManager.UpdateProductQuantity(cid,pid,qty.quantity)

    if(action===false){
        return res.status(404).send({
            status: 'error',
            message: 'error en actualizar'
        })}

    res.status(201).send({
        status: 'success',
        message: 'producto actualizado con exito'
    })

})


export default router