import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import dotenv from 'dotenv'
dotenv.config()


export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
export const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME

export const createHash = password =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user,password)=>{
    return bcrypt.compareSync(password, user.password)
}


export const generateToken = user => {
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h'})
    return token
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).render('errors/base', { error: info.messages ? info.message : info.toString()})
            req.user = user
            next()
        })(req, res, next)
    }
}

export default __dirname