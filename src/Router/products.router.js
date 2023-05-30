import { Router } from "express";
import Manager from "../DAO/Manager.MongoDB/ProductManager.js";
import { io } from "socket.io-client"


const router = Router()


router.get('/', async(req,res)=> {

    
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const query = req.query.query || ''
    const sort = req.query.sort || ''
    
    const productos = await Manager.getProductsQuerys(limit,sort,page,query)

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
        status:'success',
        payload: productos.docs,
        totalPages: productos.totalPages,
        prevPage: productos.prevPage,
        nextPage: productos.nextPage,
        page:productos.page,
        hasPrevPage: productos.hasPrevPage,
        hasNextPage: productos.hasNextPage,
        prevLink: productos.hasPrevPage==false ? null : `http://localhost:8080/api/products?limit=${limit}&page=${productos.page-1}&query=${query}&sort=${sort}`,
        nextLink: productos.hasNextPage==false ? null : `http://localhost:8080/api/products?limit=${limit}&page=${productos.page+1}&query=${query}&sort=${sort}`,

    })
})

router.get('/:pid', async (req,res)=> {
    const pid = req.params.pid

    if(isNaN(pid) || pid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad pid (Product ID) debe ser un numero mayor o igual a 0'
        })
    }

    const producto = await Manager.getProductById(pid)

    if(producto===false){
        return res.status(404).send({
            status: 'error',
            message: 'producto no existe'
        })
    }

    res.status(200).send({
        producto: producto})
})

router.post('/', async (req,res) => {
    const socket= io('http://localhost:8080')

    const product = req.body

    let {title,description,code,price,status,stock,category,thumbnails} = product

    if((!title || !description || !price || !thumbnails || !code || !stock || !status || !category )){
        return res.status(400).send({
            status: 'error',
            message: 'producto no agregado: Faltan datos en las propiedades'
        })
    }
    
    let action = await Manager.addProduct(product)


    if(action===true){

        socket.emit('change' , await Manager.getProducts())

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

router.put('/:pid', async (req,res) => {
    const socket= io('http://localhost:8080')
    const pid = req.params.pid
    const product = req.body
    console.log(product)
    
    if(product.id || product.code){
        return res.status(400).send({
            status: 'error',
            message: 'No se puede modificar el id o el code del producto'
        })
    }

    if(isNaN(pid) || pid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad pid (Product ID) debe ser un numero mayor o igual a 0'
        })
    }


    let action = await Manager.updateProduct(pid,product)

    if(action===false){
        return res.status(404).send({
            status: 'error',
            message: 'producto no existe'
        })}

    socket.emit('change' , await Manager.getProducts())
    res.status(201).send({
        status: 'success',
        message: 'producto modificado con exito'
    })

})

router.delete('/:pid', async (req,res) => {

    const socket= io('http://localhost:8080')
    const pid = req.params.pid
    
    if(isNaN(pid) || pid <= 0){
        return res.status(404).send({
            status: 'error',
            message: 'la propiedad pid (Product ID) debe ser un numero mayor a 0'
        })
    }
    
    const action = await Manager.deleteProduct(pid)

    if(action===false){
        return res.status(404).send({
            status: 'error',
            message: 'producto no existe'
        })
    }

    socket.emit('change' , await Manager.getProducts())
    res.status(200).send({
        status: 'success',
        message: 'producto eliminado con exito'
    })


})



export default router