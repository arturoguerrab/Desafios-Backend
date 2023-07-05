

import cartsModel from "../Models/carts.model.js";
import productsModel from "../Models/products.model.js";


class CartManager{

    CreateCart = async() => {


        const carts = await cartsModel.find().lean().exec()

        if(carts == ''){
            const id = 1
            const newCart = new cartsModel({id:id})
            await newCart.save()
            return true
            
        } 

        let count = await cartsModel.countDocuments()
        let cartID=""

        do {
            count++
            cartID = await cartsModel.exists({id:count}).lean().exec()
        } while ( cartID != null);
        
        const newCart = new cartsModel({id:count})
        await newCart.save()
        return true 
    }

    GetCartById = async (id) =>{

        const getAll = await cartsModel.find().lean().exec()

        if(getAll != ''){
            const cartById = await cartsModel.findOne({id:id})
            
            if(cartById == null){
                return false
            }

        
            return cartById
        }

        return false
        }
        

    AddToCart = async (cId, pId) =>{

        const product = await productsModel.find({_id:pId,}).lean().exec()
        const cart = await cartsModel.find({id:cId,}).lean().exec()
        

        if(product != '' && cart != ''){

            let exist = cart[0].products.find(element=>element._id == pId)
            
            if(!exist){
                let obj = {
                    _id:pId,
                    quantity: 1,
                
                }
                await cartsModel.findOneAndUpdate({id:cId},{products:[...cart[0].products,obj]})
                return true
            }
            
            exist.quantity++
            await cartsModel.findOneAndUpdate({id:cId},{products:[...cart[0].products]})

            return true
        }

        return false
    }

    DeleteProduct = async (cId,pId) =>{

        const getAll = await cartsModel.find().lean().exec()

        if(getAll != ''){
            const cartById = await cartsModel.find({id:cId}).lean().exec()
            
            if(cartById == ''){
                
                return false
            }
            const findItem = cartById[0].products.find((item)=> item._id == pId)

            if(cartById[0].products==[] || !findItem){
                
                return false
            }
            
            const filterCart = cartById[0].products.filter((item)=> item._id != pId)
            await cartsModel.findOneAndUpdate({id:cId},{products:filterCart})

            
            return true
        }

        
        return false

    }

    DeleteAllProducts = async (cId) =>{
        

        const getAll = await cartsModel.find().lean().exec()

        if(getAll != ''){
            const cartById = await cartsModel.find({id:cId}).lean().exec()
            
            if(cartById == ''){
                
                return false
            }

            await cartsModel.findOneAndUpdate({id:cId},{products:[]})

            
            return true
        }

        
        return false

    }

    UpdateCart = async (cId,productos) =>{
        

        const getAll = await cartsModel.find().lean().exec()

        if(getAll != ''){
            const cartById = await cartsModel.find({id:cId}).lean().exec()
            
            if(cartById == ''){
                
                return false
            }

            await cartsModel.findOneAndUpdate({id:cId},{products:productos})

            
            return true
        }

        
        return false

    }

    UpdateProductQuantity = async (cId,pId,qty) =>{
        

        const getAll = await cartsModel.find().lean().exec()

        if(getAll != ''){
            const cartById = await cartsModel.find({id:cId}).lean().exec()
            
            if(cartById == ''){
                
                return false
            }
            let element = cartById[0].products.find((item)=> item._id == pId)
            element.quantity=qty
            await cartsModel.findOneAndUpdate({id:cId},{products:[...cartById[0].products]})


            
            return true
        }

        
        return false

    }
}

const CManager = new CartManager()


export default CManager