import mongoose from "mongoose";

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

class ProductManager{

    addProduct = async (product) => {

        await connectDB()
        
        const products = await productsModel.exists({code:product.code}).lean().exec()

        if(products!=null){
            await mongoose.connection.close()
            return false
        }

        const getAll = await productsModel.find().lean().exec()

        if(getAll==''){
            const id = 1
            const newProduct = new productsModel({id:id,...product})
            await newProduct.save()
            await mongoose.connection.close()
            return true
        }

        let count = await productsModel.countDocuments()
        let itemID=""

        do {
            count++
            itemID = await productsModel.exists({id:count}).lean().exec()
        } while ( itemID != null);
        
        const newProduct = new productsModel({id:count,...product})
        await newProduct.save()
        await mongoose.connection.close()
        return true
    }

    getProducts = async() => {
        await connectDB()

        const getAll = await productsModel.find().lean().exec()

        if(getAll != ''){
            await mongoose.connection.close()
            return getAll
        }

        await mongoose.connection.close()
        return false
    }

    getProductById = async(id)=> {

        await connectDB()

        const getAll = await productsModel.find().lean().exec()

        if(getAll != ''){

            const ProductById = await productsModel.find({id:id}).lean().exec()

            if(ProductById ==''){
                await mongoose.connection.close()
                return false
            }

            await mongoose.connection.close()
            return ProductById
        }

        await mongoose.connection.close()
        return false
    }
    
    updateProduct = async (id,updates)=>{
        await connectDB()

        const findById = await productsModel.find({id:id}).lean().exec()

        if(findById != ''){

            await productsModel.findOneAndUpdate({id:id}, {...updates})
            await mongoose.connection.close()
            return true
        }

        await mongoose.connection.close()
        return false
    }


    deleteProduct = async(id) =>{

        await connectDB()

        const getAll = await productsModel.find({id:id}).lean().exec()

        if(getAll != ''){

            await productsModel.findOneAndDelete({id:id})
            await mongoose.connection.close()
            return true
            
        }

        await mongoose.connection.close()
        return false
    }
    
}
const Manager = new ProductManager()

export default Manager