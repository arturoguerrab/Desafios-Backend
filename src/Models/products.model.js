import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = "products"

const productsSchema = mongoose.Schema({

    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: Array
})

productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productsCollection, productsSchema)

export default productsModel