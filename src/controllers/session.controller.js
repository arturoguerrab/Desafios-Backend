import { JWT_COOKIE_NAME } from "../utils.js";


//REGISTER
    // CONTROLLER (GET) PARA RENDERIZAR LA VIEW REGISTER
        export const renderRegisterView = async (req, res)=>{
            res.render('sessions/register')
        }

    // CONTROLLER (GET) PARA RENDERIZAR ERROR REGISTER
        export const renderRegisterError = async (req, res)=>{
            res.render('errors/register_error')
        }

    // CONTROLLER (POST) PARA ENVIAR FORMULARIO DE REGISTRO
    export const postRegister = async (req, res)=>{
        res.redirect('/session/login')
    }


//LOGIN
    // CONTROLLER (GET) PARA RENDERIZAR LA VIEW LOGIN
        export const renderLoginView = (req, res)=>{
            return res.render('sessions/login')
        }
    // CONTROLLER (GET) PARA RENDERIZAR ERROR LOGIN
        export const renderLoginError = (req, res)=>{
            return res.render('errors/login_error')
        }
    // CONTROLLER (POST) PARA ENVIAR FORMULARIO DE LOGIN
        export const postLogin =  async (req, res)=>{

            if(!req.user){
                return res.status(401).render('errors/base',{error: 'Email no registrado '})
            }
            
            // req.session.user = {first_name: req.user.first_name, last_name: req.user.last_name, rol:req.user.rol}
            
            return res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
        }


//LOGIN GITHUB

    // CONTROLLER (GET) PARA REGISTRO CON GITHUB
        export const githubLogin = (req, res)=>{}
        export const githubCallback = (req, res)=>{

            // req.session.user = {first_name: req.user.first_name, rol:req.user.rol}
            return res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
        }


//JWT AUTHENTICATION 

    // CONTROLLER (GET) PARA AUTHENTICATION CON JWT
        export const JWTAuth = (req, res)=>{
            return res.status(200).send({
                user: req.user.user
            })
        }


//LOGOUT

    // CONTROLLER (GET) PARA EJECUTAR LOGOUT
        export const Logout = async (req, res)=>{
            // req.session.destroy(err =>{
            //     if (err) {
            //         res.status(500).render('errors/base', {error: err})
            //     }else{
            //         res.redirect('/session/login')
            //     }
            // })
            return res.clearCookie(JWT_COOKIE_NAME).redirect('/session/login')
        }
