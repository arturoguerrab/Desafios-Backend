import { cartsService, productService, userService } from "./index.js"

export default class ticketsRespository {
    constructor(dao, model) {
        this.dao = dao
        this.model = model
    }


    createTicket = async(cId)=>{
        const carrito = await cartsService.GetCarts({_id:cId})
        let productsMap = []
        
        if(carrito[0].products=='') return false

        carrito[0].products.forEach(element => {
            productsMap.push({...element._id, quantity:element.quantity})
        });

        const comprados=[]
        const devueltos=[]
        let totalPrice = 0

        productsMap.forEach(element=>{
            if(element.stock > element.quantity){
                comprados.push({
                    _id:element._id, 
                    stock:element.stock-element.quantity, 
                })
                totalPrice+= element.quantity*element.price
            }else{
                devueltos.push({
                    _id:element._id,
                    quantity:element.quantity
                })

            }
        })


        comprados.forEach(async element => {
            await productService.updateProduct(element._id, {stock:element.stock})
        });

        await cartsService.UpdateCart(cId,devueltos)

        const purchaser = await userService.getUser({cart:cId})


        return await this.dao.post({
            code:Math.trunc(Math.random()*1000000),
            amount: totalPrice,
            purchaser:purchaser[0].email
        }, this.model)

        

    }
}