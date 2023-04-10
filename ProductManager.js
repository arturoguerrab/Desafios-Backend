const fs= require('fs');

// <---- Declaracion del constructor y sus metodos ---->

class ProductManager{

    #products
    constructor() {
        this.path = "./ProductManager.txt"
        this.#products = [];
    }

    addProduct = (title,description,price,thumbnail,code,stock) => {
        const product = {title,description,price,thumbnail,code,stock}

        if (!title || !description || !price || !thumbnail || !code || !stock){
            return console.log(`<ERROR - Faltan datos para completar el registro del producto>\n`)
        }

        if(!fs.existsSync(this.path)){
            const id = 1
            this.#products.push({ id,...product})
            fs.writeFileSync(this.path, JSON.stringify(this.#products,null,'\t'))
            
        } else{
            this.#products = JSON.parse(fs.readFileSync(this.path,'utf-8'))

            const codeRepeat = this.#products.find(element=>element.code == product.code)
            if (codeRepeat){
                return console.log(`<ERROR - Producto repetido (code: ${codeRepeat.code}): No se agrego>\n`)
            }

            const lastProduct = this.#products[this.#products.length-1]
            const id = lastProduct.id + 1
            this.#products.push({ id,...product})

            fs.writeFileSync(this.path, JSON.stringify(this.#products,null,'\t'))

        }
    }

    getProducts = () => {
        if(fs.existsSync(this.path)){
            this.#products = JSON.parse(fs.readFileSync(this.path,'utf-8'))
            return this.#products
        }else{
            return 'No se ha agregado ningun producto, agrega alguno para usar esta funcion'
        }
        
    }

    getProductById = (id)=> {
        if(fs.existsSync(this.path)){
            this.#products = JSON.parse(fs.readFileSync(this.path,'utf-8'))

            const findProductById = this.#products.find(element=>element.id == id)
    
            if (!findProductById){
                return '<ERROR: Not found>\n'
            }
    
            return findProductById

        }else{
            return 'No se ha agregado ningun producto, agrega alguno para usar esta funcion'
        }
    }
    
    updateProduct = (id,propiedad,update)=>{

        if(fs.existsSync(this.path)){
            this.#products = JSON.parse(fs.readFileSync(this.path,'utf-8'))

            let findProductById = this.#products.find(element=>element.id == id)
    
            if (!findProductById){
                return console.log('<ERROR: Not found>\n')
            }

            findProductById[propiedad]= update

            this.#products.forEach(element => {
                if(element.id == findProductById.id){
                    element=findProductById
                }
            });

            fs.writeFileSync(this.path, JSON.stringify(this.#products,null,'\t'))
            return `Producto (id:${findProductById.id}) Modificado con exito`

        }else{
            return console.log('No se ha agregado ningun producto, agrega alguno para usar esta funcion')
        }

    }

    deleteProduct = (id) =>{
        if(fs.existsSync(this.path)){
            this.#products = JSON.parse(fs.readFileSync(this.path,'utf-8'))

            this.#products = this.#products.filter(element => element.id != id)

            fs.writeFileSync(this.path, JSON.stringify(this.#products,null,'\t'))

            return 'Producto eliminado con exito'
        }else{
            return console.log('No se ha agregado ningun producto, agrega alguno para usar esta funcion')
        }
    }
    
}

// <---- Declaracion del nuevo Arreglo ---->
    const productos = new ProductManager()

    // <--------- Descomentar la funcion que se desea utilizar -------->

    // productos.addProduct('Anamorphine','vela de soja',800,'https://res.cloudinary.com/dbwomkmnq/image/upload/v1676337304/Whimsy/Tarjeta%20A/tarjeta_aDos_aqqaw1.jpg',1005,255)
    // productos.addProduct('Euphoriasme','vela de soja',900,'https://res.cloudinary.com/dbwomkmnq/image/upload/v1676337335/Whimsy/Tarjeta%20C/tarjeta_cDos_ckx5ka.jpg',1006,800)
    // productos.addProduct('Nudesse','vela de soja',600,'https://res.cloudinary.com/dbwomkmnq/image/upload/v1676337405/Whimsy/Tarjeta%20G/tarjeta_g_rltmno.jpg',1007,500)
    // productos.addProduct('Morphine','vela de soja',500,'https://res.cloudinary.com/dbwomkmnq/image/upload/v1676337304/Whimsy/Tarjeta%20A/tarjeta_aDos_aqqaw1.jpg',1008,45)

    // console.log(productos.getProducts())

    // console.log(productos.getProductById(1))

    // productos.updateProduct(2,'title','Modificado')

    // productos.deleteProduct(2)