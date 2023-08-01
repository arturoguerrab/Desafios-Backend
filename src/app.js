// EXPRESS IMPORTS
import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import errorHandler from'./middlewares/error.middleware.js'
import logger from './logger/logger.js'

// PASSPORT IMPORTS
    import passport from 'passport'
    import initializePassport from './config/passport.config.js'
    import cookieParser from 'cookie-parser'

// MOONGOSE IMPORTS
    import mongoose from 'mongoose'
    // import MongoStore from 'connect-mongo'

// SOCKET IMPORTS
    import { Server } from 'socket.io'

// ENVOIREMTS VARIABLES IMPORTS
    import dotenv from 'dotenv'
    dotenv.config()

// ROUTERS IMPORTS
    import productRouter from './Router/products.router.js'
    import cartsRouter from './Router/carts.router.js'
    import viewsRouter from './Router/views.router.js'
    import messagesRouter from './Router/messages.router.js'
    import sessionRouter from './Router/session.router.js'

// <-------------------------IMPORTS END-------------------------------------->


// EXPRESS CONFIG
    const app = express()
    app.use (express.json())
    app.use(express.static(__dirname+'/public'))
    app.use (express.urlencoded())
    
    
    
    // SESSION CONFIG
    app.use(session({
        // store: MongoStore.create({
        //     mongoUrl:'mongodb+srv://coderhouse:coderhouse@cluster-coderhouse.zdvxeq6.mongodb.net',
        //     dbName: 'session'
        // }),
        secret:'c0d3r',
        resave:true,
        saveUninitialized:true
    }))


    // COOKIES CONFIG
    app.use(cookieParser())
    

    // PASSPORT CONFIG
    initializePassport()
    app.use(passport.initialize())
    app.use(passport.session())


// HANDLEBARS CONFIG
    app.engine('handlebars', handlebars.engine())
    app.set('views',__dirname+'/views')
    app.set('view engine', 'handlebars')
    


// ROUTING CONFIG
    app.use('/api/products', productRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/', viewsRouter)
    app.use('/chat', messagesRouter)
    app.use('/session', sessionRouter)
    app.use(errorHandler)
    

// MONGOOSE CONFIG
    const url = process.env.MONGO_URI
    mongoose.set("strictQuery",false)


// EXPRESS AND SOCKET SERVER RUN
    try {
        await mongoose.connect(url)
        logger.info("DB Connected");
        

        const httpServer = app.listen(8080, () =>{logger.http('Listening...') })
        const io = new Server(httpServer)
        

        io.on('connection', (socket)=>{

            logger.info('Socket client conected...')
            
            socket.on('change', (data)=>{
                io.emit('products', data)
            })
            socket.on('send', (data)=>{
                io.emit('messages', data)
            })
        })
            
    }
    catch{
        logger.fatal("ERROR TO ACCESS ON DB");
    }





