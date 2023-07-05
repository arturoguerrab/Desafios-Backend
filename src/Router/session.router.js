import { Router } from "express";
import passport from "passport";
import { passportCall } from "../utils.js";
import { JWTAuth, Logout, githubCallback, githubLogin, postLogin, postRegister, renderLoginError, renderLoginView, renderRegisterError, renderRegisterView } from "../controllers/session.controller.js";

const router = Router()


//REGISTER
    router.get('/register', renderRegisterView)
    router.get('/errors/register_error', renderRegisterError )
    router.post('/register', passport.authenticate('register', {failureRedirect: 'errors/register_error'}), postRegister)


//LOGIN
    router.get('/login', renderLoginView )
    router.get('/errors/login_error', renderLoginError)
    router.post('/login', passport.authenticate('login', {failureRedirect:'errors/login_error'}), postLogin)


//LOGIN GITHUB
    router.get('/github', passport.authenticate('github', {scope:['user:email']}), githubLogin)
    router.get('/githubcallback', passport.authenticate('github', {failureRedirect: 'login'}), githubCallback)


//JWT AUTHENTICATION 
    router.get('/current', passportCall('current'), JWTAuth )
    


//LOGOUT
    router.get('/logout', Logout)



export default router