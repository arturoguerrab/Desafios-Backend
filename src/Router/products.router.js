import { Router } from "express";
import { deleteProduct, getProducts, getProductsByID, postProduct, updateProduct } from "../controllers/products.controller.js";

const router = Router()

router.get('/', getProducts)

router.get('/:pid', getProductsByID)

router.post('/', postProduct)

router.put('/:pid', updateProduct)

router.delete('/:pid', deleteProduct )

export default router