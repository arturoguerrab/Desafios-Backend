import mongoose from "mongoose"

const cartsCollection = "carts"

const productsSchema = new mongoose.Schema({
    _id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    quantity:{
        type:Number,
        default:1
    }
},{_id:false})

const cartsSchema = mongoose.Schema({
    products: {
        type:[productsSchema],
        default:[]
    }
})


cartsSchema.pre('find', function(){
    this.populate('products._id')
})
const cartsModel = mongoose.model(cartsCollection, cartsSchema)

export default cartsModel