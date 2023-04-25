import fs from 'fs'

class ProductManager{

    #products
    constructor() {
        this.path = "./Data/products.json"
        this.#products = [];
    }

    addProduct = (product) => {
        
        if(!fs.existsSync(this.path)){
            const id = 1
            this.#products.push({ id,...product})
            fs.writeFileSync(this.path, JSON.stringify(this.#products,null,'\t'))
            return true
            
        } 

        this.#products = JSON.parse(fs.readFileSync(this.path,'utf-8'))
        const codeRepeat = this.#products.find(element=>element.code == product.code)

        if (codeRepeat){
            return false
        }

        const lastProduct = this.#products[this.#products.length-1]
        const id = lastProduct.id + 1
        this.#products.push({ id,...product})

        fs.writeFileSync(this.path, JSON.stringify(this.#products,null,'\t'))
        return true

    }

    getProducts = () => {

        if(fs.existsSync(this.path)){
            this.#products = JSON.parse(fs.readFileSync(this.path,'utf-8'))
            return this.#products
        }
        
        return false
        
        
    }

    getProductById = (id)=> {

        if(fs.existsSync(this.path)){
            this.#products = JSON.parse(fs.readFileSync(this.path,'utf-8'))

            const findProductById = this.#products.find(element=>element.id == id)
    
            if (!findProductById){
                return false
            }
    
            return findProductById

        }
        
        return false
        
    }
    
    updateProduct = (id,updates)=>{

        if(fs.existsSync(this.path)){

            this.#products = JSON.parse(fs.readFileSync(this.path,'utf-8'))

            let findProductById = this.#products.findIndex(element=>element.id == id)
    
            if (findProductById == -1){
                return false
            }
            
            this.#products[findProductById] = {...this.#products[findProductById], ...updates}

            fs.writeFileSync(this.path, JSON.stringify(this.#products,null,'\t'))
            return true
        }

            return false

    }

    deleteProduct = (id) =>{
        if(fs.existsSync(this.path)){
            this.#products = JSON.parse(fs.readFileSync(this.path,'utf-8'))

            if(this.#products.some(element => element.id == id)) {

                this.#products = this.#products.filter(element => element.id != id)
                fs.writeFileSync(this.path, JSON.stringify(this.#products,null,'\t'))

                return true
            }

            return false
        }
        
        return false
        
    }
    
}
const Manager = new ProductManager()

export default Manager
