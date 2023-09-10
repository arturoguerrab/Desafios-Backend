import mongoose from "mongoose";

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password:String,
    cart:String,
    rol:{ 
        type:String,
        default:'user'
    },
    documents:{
        type:Array,
        default:[]

    },
    last_connection:{
        type:Date , 
        default:Date.now
    },
}
)


mongoose.set('strictQuery',false)

const userModel = mongoose.model(userCollection,userSchema)

export default userModel