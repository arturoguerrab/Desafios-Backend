import mongoose from "mongoose";

import cartsModel from "../Models/carts.model.js";
import productsModel from "../Models/products.model.js";

const url = "mongodb+srv://coderhouse:coderhouse@cluster-coderhouse.zdvxeq6.mongodb.net/ecommerce"


const connectDB = async()=>{

    mongoose.set("strictQuery",false)
    try {
        await mongoose.connect(url)
        
        console.log("DB Connected");
    }
    catch{
        console.log("No se puede conectar a la DB");
    }
}

class CartManager{

    CreateCart = async() => {

        await connectDB()

        const carts = await cartsModel.find().lean().exec()

        if(carts == ''){
            const id = 1
            const newCart = new cartsModel({id:id})
            await newCart.save()
            await mongoose.connection.close()
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
        await mongoose.connection.close()
        return true 
    }

    GetCartById = async (id) =>{
        await connectDB()

        const getAll = await cartsModel.find().lean().exec()

        if(getAll != ''){
            const cartById = await cartsModel.find({id:id}).lean().exec()
            
            if(cartById == ''){
                await mongoose.connection.close()
                return false
            }

            await mongoose.connection.close()
            return cartById
        }

        await mongoose.connection.close()
        return false

        }
        

    AddToCart = async (cId, pId) =>{

        await connectDB()
        
        const product = await productsModel.find({id:pId,}).lean().exec()
        const cart = await cartsModel.find({id:cId,}).lean().exec()

        if(product != '' && cart != ''){

            let exist = cart[0].products.find(element=>element.product === pId)

            if(!exist){
                let obj = {
                    product: pId,
                    quantity: 1
                }
                await cartsModel.findOneAndUpdate({id:cId},{products:[...cart[0].products,obj]})
                await mongoose.connection.close()
                return true
            }
            
            exist.quantity++
            await cartsModel.findOneAndUpdate({id:cId},{products:[...cart[0].products]})

            await mongoose.connection.close()
            return true
        }

        await mongoose.connection.close()
        return false
    }
}

const CManager = new CartManager()

export default CManager