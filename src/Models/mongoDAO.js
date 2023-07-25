import mongoose from 'mongoose'

import userModel from './user.model.js'
import productsModel from './products.model.js'
import messagesModel from './messages.model.js'
import cartsModel from './carts.model.js'
import ticketModel from './ticket.model.js'


export default class MongoDAO {
    constructor(config) {
        this.mongoose = mongoose.connect(config.url).catch(err => {
            console.log(err.message)
            process.exit()
        })
        this.models = {
            ['users']: userModel,
            ['products']: productsModel,
            ['messages']: messagesModel,
            ['carts']: cartsModel,
            ['tickets']: ticketModel,

        }
    }

    get = async (options, entity) => {
        if (!this.models[entity]) throw new Error('Entity not found in models')
        try {
            let results = await this.models[entity].find(options).lean().exec()
            return results
        } catch(err) {
            console.log(err.message)
            return null
        }
    }

    getPaginate = async (query, options, entity) => {
        if (!this.models[entity]) throw new Error('Entity not found in models')
        try {
            let results = await this.models[entity].paginate(query,options)
            return results
        } catch(err) {
            console.log(err.message)
            return null
        }
    }

    post = async(document, entity) => {
        if (!this.models[entity]) throw new Error('Entity not found in models')
        try {
            let instance = new this.models[entity](document)
            let result = await instance.save()
            return result
        } catch(err) {
            console.log(err.message)
            return null
        }
    }

    update = async (options, updates, entity) => {
        if (!this.models[entity]) throw new Error('Entity not found in models')
        try {
            let results = await this.models[entity].findOneAndUpdate(options, updates)
            return results
        } catch(err) {
            console.log(err.message)
            return null
        }
    }

    delete = async (options, entity) => {
        if (!this.models[entity]) throw new Error('Entity not found in models')
        try {
            let results =  await this.models[entity].findOneAndDelete(options)
            return results
        } catch(err) {
            console.log(err.message)
            return null
        }
    }

}