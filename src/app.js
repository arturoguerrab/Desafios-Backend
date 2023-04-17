const express = require('express')
const fs= require('fs');
const path = "./ProductManager.txt"

const app= express()

app.get('/products', (request,response)=> {
    const productos = JSON.parse(fs.readFileSync(path,'utf-8'))
    const limit = request.query.limit

    response.send({
        productos: productos.slice(0,limit)})
})

app.get('/products/:pid', (request,response)=> {
    const productos = JSON.parse(fs.readFileSync(path,'utf-8'))
    const pid = request.params.pid
    const result = productos.find (item => item.id == pid)
    response.send(result)
})


app.listen(8080, () =>{ })