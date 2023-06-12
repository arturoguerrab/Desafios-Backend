import passport from "passport"
import local from 'passport-local'
import { createHash, isValidPassword } from "../utils.js"
import userModel from "../DAO/Models/user.model.js"
import GitHubStrategy from 'passport-github2'
// import userGitHubModel from "../DAO/Models/user.model.github.js"
import dotenv from 'dotenv'
dotenv.config()


const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, age, email, rol } = req.body
        try {
            const user = await userModel.findOne({ email: username })
            if (user) {
                console.log('User already exists!')
                return done(null, false)
            }
            const newUser = {
                first_name, last_name, age, email,rol,
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

            if (user) return done(null, user)

            const newUser = await userModel.create({
                first_name: profile._json.name,
                email: profile._json.email
            })

            return done(null, newUser)
        } 
        catch(err) {
            return done('Error to login with github' + err)
        }

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