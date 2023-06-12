import mongoose from "mongoose";

const userCollection = 'users'

const userGHSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password:String,
    rol:{ 
        type:String,
        default:'usuario'
    }
})

mongoose.set('strictQuery',false)

const userGitHubModel = mongoose.model(userCollection,userGHSchema)

export default userGitHubModel