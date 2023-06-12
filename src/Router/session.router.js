import { Router } from "express";
import passport from "passport";

const router = Router()

router.get('/register', (req, res)=>{
    res.render('sessions/register')
})

router.get('/errors/register_error', (req, res)=>{
    res.render('errors/register_error')
})

router.post('/register', passport.authenticate('register', {failureRedirect: 'errors/register_error'}), async (req, res)=>{
    res.redirect('/session/login')
})

router.get('/login', (req, res)=>{
    res.render('sessions/login')
})

router.get('/errors/login_error', (req, res)=>{
    res.render('errors/login_error')
})

router.post('/login', passport.authenticate('login', {failureRedirect:'errors/login_error'}), async (req, res)=>{


    if(!req.user){
        return res.status(401).render('errors/base',{error: 'Email no registrado '})
    }
    
    req.session.user = {first_name: req.user.first_name, last_name: req.user.last_name, rol:req.user.rol}
    
    res.redirect('/products')
})

router.get('/logout', async (req, res)=>{
    req.session.destroy(err =>{
        if (err) {
            res.status(500).render('errors/base', {error: err})
        }else{
            res.redirect('/session/login')
        }
    })
})

router.get('/github', passport.authenticate('github', {scope:['user:email']}), (req, res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: 'login'}), (req, res)=>{
    
    req.session.user = {first_name: req.user.first_name, rol:req.user.rol}
    
    res.redirect('/products')
})

export default router