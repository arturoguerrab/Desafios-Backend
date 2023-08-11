import MongoDAO from '../Models/mongoDAO.js';
import config from '../config/config.js';

import cartsRespository from './cartsRepository.js';
import messagesRespository from './messagesRepository.js';
import productsRespository from './productsRepository.js';
import ticketsRespository from './ticketsRepository.js';
import userPasswordRespository from './userPasswordRepository.js';
import userRespository from './userRepository.js';

let dao

switch(config.app.persistence) {
    case "MONGO": 
        dao = new MongoDAO(config.mongo)
        break
}

export const userService = new userRespository(dao,'users')
export const productService = new productsRespository(dao,'products')
export const cartsService = new cartsRespository(dao,'carts')
export const messagesService = new messagesRespository(dao,'messages')
export const TicketsService = new ticketsRespository(dao,'tickets')
export const passwordService = new userPasswordRespository(dao,'userPassword')