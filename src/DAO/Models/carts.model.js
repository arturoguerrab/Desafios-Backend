import mongoose from "mongoose"

const cartsCollection = "carts"

const cartsSchema = mongoose.Schema({

    id: Number,
    products: Array
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema)

export default cartsModel