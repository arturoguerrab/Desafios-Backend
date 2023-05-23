import mongoose from "mongoose"

const productsCollection = "products"

const productsSchema = mongoose.Schema({

    id: Number,
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: Array
})

const productsModel = mongoose.model(productsCollection, productsSchema)

export default productsModel