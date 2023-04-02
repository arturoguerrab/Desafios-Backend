class ProductManager{

    #products
    constructor() {
        this.#products = []
        this.index = 0
    }

    addProduct(title,description,price,thumbnail,code,stock){

        const product = {title,description,price,thumbnail,code,stock}

        if (!title || !description || !price || !thumbnail || !code || !stock){
            return console.log(`*\n<ERROR - Faltan datos para completar el registro del producto>\n*`)
        }

        const codeRepeat = this.#products.find(element=>element.code == product.code)
        
        if (codeRepeat){
            return console.log(`*\n<ERROR - Producto repetido (code: ${codeRepeat.code}): No se agrego>\n*`)
        }

        this.index++
        const id = this.index
        this.#products.push({ id,...product})
        

    }
    getProducts = () => {
        return this.#products
    }

    getProductById(id){

        const findProductById = this.#products.find(element=>element.id == id)

        if (!findProductById){
            return console.log('*\n<ERROR: Not found>\n*')
        }

        return findProductById

    }
    
    
}

const product = new ProductManager()

product.addProduct('anti','vela de soja',800,'link',1005,255)
product.addProduct('anti','vela de soja',800,'link',1005,800)
product.addProduct('anti','vela de soja',800,'link',1006,500)
product.addProduct('anti','vela de soja',800,'link',1008)

console.log(product.getProducts())
