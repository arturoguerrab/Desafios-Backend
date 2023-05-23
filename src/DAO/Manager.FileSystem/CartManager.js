import fs from 'fs'
import PManager from "./ProductManager.js";


class CartManager{

    #carts
    constructor() {
        this.path = "./src/Data/carts.json"
        this.#carts = [];
    }

    CreateCart = () => {

        if(!fs.existsSync(this.path)){
            const id = 1
            this.#carts.push({ id, products:[]})
            fs.writeFileSync(this.path, JSON.stringify(this.#carts,null,'\t'))
            return true
            
        } 

        this.#carts = JSON.parse(fs.readFileSync(this.path,'utf-8'))

        const lastCart = this.#carts[this.#carts.length-1]
        const id = lastCart.id + 1

        this.#carts.push({ id, products:[]})

        fs.writeFileSync(this.path, JSON.stringify(this.#carts,null,'\t'))
        return true
        
    }

    GetCartById = (id) =>{

        if(fs.existsSync(this.path)){
            this.#carts = JSON.parse(fs.readFileSync(this.path,'utf-8'))

            const findCartById = this.#carts.find(element=>element.id == id)
    
            if (!findCartById){
                return false
            }
    
            return findCartById

        }
        
        return false
    }

    AddToCart = (cId, pId) =>{

        if(fs.existsSync(this.path)){

            this.#carts = JSON.parse(fs.readFileSync(this.path,'utf-8'))

            let cart = this.GetCartById(cId)
            let producto = PManager.getProductById(pId)
            
            if(cart===false || producto===false){
                return false
            }

            let exist = cart.products.find(element=>element.product === producto.id)
            
            if(!exist){

                let obj = {
                    product: producto.id,
                    quantity: 1
                }

                let findCartById = this.#carts.findIndex(element=>element.id == cart.id)

                this.#carts[findCartById].products = [...this.#carts[findCartById].products, obj]
    
                
                

            fs.writeFileSync(this.path, JSON.stringify(this.#carts,null,'\t'))
            return true

            }

            let findCartById = this.#carts.findIndex(element=>element.id == cart.id)
            let findProductById = this.#carts[findCartById].products.findIndex(element=>element.product == exist.product)
            this.#carts[findCartById].products[findProductById].quantity++

            this.#carts[findCartById].products[findProductById] = {...exist}
            fs.writeFileSync(this.path, JSON.stringify(this.#carts,null,'\t'))

            return true

        }
        
        return false
    }
}

const CManager = new CartManager()

export default CManager