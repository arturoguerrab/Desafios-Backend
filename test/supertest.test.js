import { faker } from "@faker-js/faker";
import chai from "chai";
import supertest from "supertest";

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


describe('Testing router product', ()=>{
    it('Endpoint GET de api/products - Funcion de la paginacion de productos', async()=>{
        

        const response = await requester.get('/api/products')
        const {_body} =response
        
        expect(_body.status).to.be.eq('success')

    })

    it('Endpoint GET de api/products - Traer producto por su id', async()=>{
        

        const response = await requester.get('/api/products/646bb430c4f8e37c6914cd7b')
        const {_body} =response
        
        expect(_body.status).to.be.eq('success')

    })

})


describe('Testing router carts', ()=>{
    it('Endpoint POST de api/carts - Funcion de la creacion de un carrito', async()=>{
        

        const response = await requester.post('/api/carts')
        const {_body} =response
        
        expect(_body.status).to.be.eq('success')

    })

    it('Endpoint GET de api/carts - traer carrito por su ID', async()=>{
        

        const response = await requester.get('/api/carts/64ec19491a23f8305b81e93e')
        const {_body} =response
    
        expect(_body.status).to.be.eq('success')

    })

})