import express from 'express'
import productRouter from './Router/products.router.js'
import cartsRouter from './Router/carts.router.js'
import viewsRouter from './Router/views.router.js'
import messagesRouter from './Router/messages.router.js'
import sessionRouter from './Router/session.router.js'
import session from 'express-session'
import cookieParser from 'cookie-parser'
// import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import mongoose from 'mongoose'


const app = express()

app.use(session({
    // store: MongoStore.create({
    //     mongoUrl:'mongodb+srv://coderhouse:coderhouse@cluster-coderhouse.zdvxeq6.mongodb.net',
    //     dbName: 'session'
    // }),
    secret:'c0d3r',
    resave:true,
    saveUninitialized:true
}))

app.use(cookieParser())

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.use (express.json())
app.use(express.static(__dirname+'/public'))
app.use (express.urlencoded())

app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)
app.use('/chat', messagesRouter)
app.use('/session', sessionRouter)


app.engine('handlebars', handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine', 'handlebars')


const url = "mongodb+srv://coderhouse:coderhouse@cluster-coderhouse.zdvxeq6.mongodb.net/ecommerce"


mongoose.set("strictQuery",false)

try {
    await mongoose.connect(url)
    
    console.log("DB Connected");
    const httpServer = app.listen(8080, () =>{console.log('server up') })
    const io = new Server(httpServer)
    
    io.on('connection', (socket)=>{
        console.log('cliente socket conectado...')
        
        socket.on('change', (data)=>{
            io.emit('products', data)
        })
    })
        
}

catch{
    console.log("No se puede conectar a la DB");
}





