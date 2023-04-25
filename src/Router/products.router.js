import { Router } from "express";
import Manager from "../Manager/ProductManager.js";

const router = Router()


router.get('/', (req,res)=> {

    const productos = Manager.getProducts()
    const limit = req.query.limit || productos.length
    
    if(isNaN(limit) || limit <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad limit debe ser un numero mayor o igual a 0'
        })
    }
    
    if(productos===false){
        return res.status(404).send({
            status: 'error',
            message: 'productos esta vacio, intenta agregar un nuevo producto'
        })
    }


    res.status(200).send({
        productos: productos.slice(0,limit)})
})

router.get('/:pid', (req,res)=> {
    const pid = req.params.pid

    if(isNaN(pid) || pid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad pid (Product ID) debe ser un numero mayor o igual a 0'
        })
    }

    const producto = Manager.getProductById(pid)

    if(producto===false){
        return res.status(404).send({
            status: 'error',
            message: 'producto no existe'
        })
    }

    res.status(200).send({
        producto: producto})
})

router.post('/', (req,res) => {
    const product = req.body

    let {title,description,code,price,status,stock,category,thumbnails} = product

    if((!title || !description || !price || !thumbnails || !code || !stock || !status || !category )){
        return res.status(400).send({
            status: 'error',
            message: 'producto no agregado: Faltan datos en las propiedades'
        })
    }
    
    let action = Manager.addProduct(product)


    if(action===true){
        return res.status(201).send({
            status: 'success',
            message: 'producto agregado con exito'
        })
    }
    
    res.status(400).send({
        status: 'error',
        message: 'producto no agregado: Propiedad <Code> en el Producto esta repetida'
    })
    

})

router.put('/:pid', (req,res) => {

    const pid = req.params.pid
    const product = req.body
    
    if(product.id){
        return res.status(400).send({
            status: 'error',
            message: 'No se puede modificar el id del producto'
        })
    }

    if(isNaN(pid) || pid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad pid (Product ID) debe ser un numero mayor o igual a 0'
        })
    }


    let action = Manager.updateProduct(pid,product)

    if(action===false){
        return res.status(404).send({
            status: 'error',
            message: 'producto no existe'
        })}

    res.status(201).send({
        status: 'success',
        message: 'producto modificado con exito'
    })

})

router.delete('/:pid', (req,res) => {
    const pid = req.params.pid
    
    if(isNaN(pid) || pid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad pid (Product ID) debe ser un numero mayor o igual a 0'
        })
    }
    
    const action = Manager.deleteProduct(pid)

    if(action===false){
        return res.status(404).send({
            status: 'error',
            message: 'producto no existe'
        })
    }

    res.status(200).send({
        status: 'success',
        message: 'producto eliminado con exito'
    })


})



export default router