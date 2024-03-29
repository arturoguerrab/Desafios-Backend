// EXPRESS IMPORTS
    import express from 'express'
    import session from 'express-session'
    import handlebars from 'express-handlebars'
    import __dirname from './utils.js'
    import errorHandler from'./middlewares/error.middleware.js'
    import logger from './logger/logger.js'
    import swaggerJSDoc from 'swagger-jsdoc'
    import  SwaggerUiExpress  from 'swagger-ui-express'

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
    import testRouter from './Router/test.router.js'
    import usersRouter from './Router/users.router.js'


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


//SWAGGER
    const swaggerOptions = {
        definition:{
            openapi:'3.0.1',
            info:{
                title: 'Documentacion de api Coderhouse',
                description: 'Alumno Arturo Guerra'
            }
        },
        apis: ['src/docs/*.yaml']
    }

    const specs = swaggerJSDoc(swaggerOptions)
    app.use('/docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs))

// ROUTING CONFIG
    app.use('/api/products', productRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/', viewsRouter)
    app.use('/', testRouter)
    app.use('/api/users', usersRouter)
    app.use('/chat', messagesRouter)
    app.use('/session', sessionRouter)
    app.use(errorHandler)
    

// MONGOOSE CONFIG
    // const url = process.env.MONGO_URI
    mongoose.set("strictQuery",false)


// EXPRESS AND SOCKET SERVER RUN
    const port = process.env.PORT || 8080;
    try {
        // await mongoose.connect(url)
        // logger.info("DB Connected");
        

        const httpServer = app.listen(port ,"0.0.0.0", () =>{logger.http('Listening...') })
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





