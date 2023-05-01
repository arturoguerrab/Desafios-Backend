import express from 'express'
import productRouter from './Router/products.router.js'
import cartsRouter from './Router/carts.router.js'
import viewsRouter from './Router/views.router.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'


const app = express()

app.use (express.json())
// app.use (express.urlencoded())

app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)



const httpServer = app.listen(8080, () =>{console.log('server up') })
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname+'/public'))

io.on('connection', (socket)=>{
    console.log('cliente socket conectado...')

    socket.on('change', (data)=>{
        io.emit('products', data)
    })


    })




