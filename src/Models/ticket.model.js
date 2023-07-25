import mongoose from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: String,
    amount: Number,
    purchaser: String
    },
    {timestamps:true}
)

mongoose.set('strictQuery',false)

const ticketModel = mongoose.model(ticketCollection,ticketSchema)

export default ticketModel