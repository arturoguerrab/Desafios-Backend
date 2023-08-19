import { Router } from "express";
import { deleteProduct, getProducts, getProductsByID, postProduct, updateProduct } from "../controllers/products.controller.js";
import { AdminPass } from "../utils.js";

const router = Router()

router.get('/', getProducts)

router.get('/:pid', getProductsByID)

router.post('/',AdminPass('current'), postProduct)

router.put('/:pid', updateProduct)

router.delete('/:pid',AdminPass('current'), deleteProduct )

export default router