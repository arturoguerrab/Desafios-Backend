
// <---- Declaracion del constructor y sus metodos ---->

class ProductManager{

    #products
    constructor() {
        this.#products = []
        this.index = 0
    }

    addProduct(title,description,price,thumbnail,code,stock){
        const product = {title,description,price,thumbnail,code,stock}

        if (!title || !description || !price || !thumbnail || !code || !stock){
            return console.log(`<ERROR - Faltan datos para completar el registro del producto>\n`)
        }

        const codeRepeat = this.#products.find(element=>element.code == product.code)
        
        if (codeRepeat){
            return console.log(`<ERROR - Producto repetido (code: ${codeRepeat.code}): No se agrego>\n`)
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
            return console.log('<ERROR: Not found>\n')
        }

        return findProductById
    }
    
    
}

// <---- Declaracion del nuevo Arreglo ---->
    const productos = new ProductManager()

// <---- Productos con code repetido ---->
    productos.addProduct('Anamorphine','vela de soja',800,'https://res.cloudinary.com/dbwomkmnq/image/upload/v1676337304/Whimsy/Tarjeta%20A/tarjeta_aDos_aqqaw1.jpg',1005,255)

    productos.addProduct('Morphine','vela de soja',500,'https://res.cloudinary.com/dbwomkmnq/image/upload/v1676337304/Whimsy/Tarjeta%20A/tarjeta_aDos_aqqaw1.jpg',1005,45)
// <----------------------------------------->

// <---- Producto con un faltante en los datos (description, price, stock) ---->
    productos.addProduct('Valkiria',undefined ,null,'https://res.cloudinary.com/dbwomkmnq/image/upload/v1676337367/Whimsy/Tarjeta%20E/tarjeta_eDos_ds6een.jpg',1008)
// <----------------------------------------->

// <---- Productos de relleno ---->
    productos.addProduct('Euphoriasme','vela de soja',900,'https://res.cloudinary.com/dbwomkmnq/image/upload/v1676337335/Whimsy/Tarjeta%20C/tarjeta_cDos_ckx5ka.jpg',1006,800)

    productos.addProduct('Nudesse','vela de soja',600,'https://res.cloudinary.com/dbwomkmnq/image/upload/v1676337405/Whimsy/Tarjeta%20G/tarjeta_g_rltmno.jpg',1007,500)
// <----------------------------------------->


// <---- Metodo para llamar a todos los productos del arreglo ---->
    console.log(productos.getProducts())


// <---- Metodo para llamar a un producto del arreglo por su id (Si existe, lo devuelve. Si no, da error:not found) ---->
    console.log(productos.getProductById(2))
    console.log(productos.getProductById(5))