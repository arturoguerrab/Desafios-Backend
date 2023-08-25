import { faker } from "@faker-js/faker";
import chai from "chai";
import supertest from "supertest";
import { AdminPass, extractCookie, generateToken } from "../src/utils.js";
import { ExtractJwt } from "passport-jwt";
import passport from "passport";

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing router session', ()=>{
    it('Endpoint POST de session/register - Registrar un usuario', async()=>{
        const person = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.string.numeric({length:2}),
            password: faker.string.alphanumeric({length:10})
            
        }
        const response = await requester.post('/session/register').send(person)
        const {text} =response

        expect(text).to.be.eq('Found. Redirecting to /session/login')

    })

    it('Endpoint POST de session/register - No se debe registrar si se repite el usuario', async()=>{
        const person = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: "arturoguerraba@gmail.com",
            age: faker.string.numeric({length:2}),
            password: faker.string.alphanumeric({length:10})
            
        }
        const response = await requester.post('/session/register').send(person)
        const {text} =response
        expect(text).to.be.eq('Found. Redirecting to errors/register_error')

    })
})


// describe('Testing router product', ()=>{
//     it('Endpoint POST de api/products - Crear un nuevo producto', async()=>{
//         const person = {
//             first_name: faker.person.firstName(),
//             last_name: faker.person.lastName(),
//             email: "arturoguerraba@gmail.com",
//             age: faker.string.numeric({length:2}),
//             password: 'hola',
//             rol:'admin'
            
//         }
//         const product={
//             title: "Anamorphine",
//             description: "Peonías y Rosas Damascenas + Frambuesas",
//             code: "1003",
//             price: 798,
//             status: true,
//             stock: 70,
//             category: "overose",
//             thumbnails: "https://res.cloudinary.com/dbwomkmnq/image/upload/v1676337304/Whimsy/Tarjeta%20A/tarjeta_a_i1grfh.jpg"
                
//         }
        
//         const token = generateToken(person)
//             person.token = token


//         const response = await requester.post(passport.authenticate('login'),'/api/products').send(product)
//         const {text} =response

//         // console.log(response);
        
//         // expect(text).to.be.eq('Found. Redirecting to /session/login')

//     })

// })