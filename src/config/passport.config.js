import passport from "passport"
import local from 'passport-local'
import passport_jwt, { ExtractJwt } from "passport-jwt"
import { JWT_PRIVATE_KEY, createHash, extractCookie, generateToken, isValidPassword } from "../utils.js"
import userModel from "../DAO/Models/user.model.js"
import GitHubStrategy from 'passport-github2'
// import userGitHubModel from "../DAO/Models/user.model.github.js"
import dotenv from 'dotenv'
dotenv.config()


const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, age, email, rol} = req.body
        try {
            const user = await userModel.findOne({ email: username })
            if (user) {
                console.log('User already exists!')
                return done(null, false)
            }
            const newUser = {
                first_name, last_name, age, email,rol,cart:'id',
                password: createHash(password)
            }
            const result = await userModel.create(newUser)

            return done(null, result)
        } catch(error) {
            return done('Error en passport REGISTER ' + error)
        }
    }))

    passport.use('login', new LocalStrategy({

        usernameField: 'email'
    }, async(email, password, done) => {
        try {
            const user = await userModel.findOne({ email: email })

            if (!user) {
                console.log('User does not exists')
                return done(null, user)
            }

            if(!user.password){
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)

            const token = generateToken({first_name:user.first_name, last_name:user.last_name, email:user.email, rol:user.rol})
            user.token = token
            return done(null, user)
        } catch(error) {
            done('error')
        }
    }))

    passport.use('github', new GitHubStrategy({
        
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/session/githubcallback'

    }, async(accessToken, refreshToken, profile, done) => {

        if (!profile._json.email) return done('Error to login with github because your github account doesnt have and email')

        try {

            const user = await userModel.findOne({ email: profile._json.email })

            if (user){
                const token = generateToken({first_name:user.first_name, email:user.email, rol:user.rol})
                user.token = token
                return done(null, user)
            } 

            const newUser = await userModel.create({
                first_name: profile._json.name,
                email: profile._json.email
            })

            const token = generateToken({first_name:newUser.first_name, email:newUser.email, rol:newUser.rol})
            newUser.token = token

            return done(null, newUser)
        } 
        catch(err) {
            return done('Error to login with github' + err)
        }

    }))

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        done(null, jwt_payload)
    }))


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport