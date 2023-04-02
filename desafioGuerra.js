class ProductManager{

    constructor (title,description,price,thumbnail,code,stock){
        this.title=title;
        this.description=description;
        this.price=price;
        this.thumbnail=thumbnail;
        this.code=code;
        this.stock=stock;
    }
    addProduct(cantidad){
        this.stockReal= this.stockReal-cantidad;
    }
    getProducts(cantidad){
        this.stockReal= this.stockReal-cantidad;
    }
    getProductById(cantidad){
        this.stockReal= this.stockReal-cantidad;
    }
    
}

console.log("hola")