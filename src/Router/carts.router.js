import { Router } from "express";
import CManager from "../Manager/CartManager.js";

const router = Router()

router.post('/', (req,res) => {
    
    CManager.CreateCart()
    
    res.status(201).send({
        status: 'success',
        message: 'nuevo carrito creado con exito'
    })
    }
    
)

router.get('/:cid', (req,res)=> {
    const cid = req.params.cid

    if(isNaN(cid) || cid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad cid (Cart ID) debe ser un numero mayor o igual a 0'
        })
    }

    const carrito = CManager.GetCartById(cid)

    if(carrito===false){
        return res.status(404).send({
            status: 'error',
            message: `Carrito ${cid} no existe`
        })
    }

    res.status(200).send({
        producto: carrito.products})
})

router.post('/:cid/product/:pid', (req,res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    if(isNaN(cid) || cid <= 0 || isNaN(pid) || pid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'las propiedades pid (Product ID) y cid (Cart ID) deben ser un numero mayor o igual a 0'
        })
    }

    
    let action = CManager.AddToCart(cid,pid)

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




export default router