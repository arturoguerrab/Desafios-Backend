import { Router } from "express";
import { UpdateAllCart, UpdateProductQty, addToCartByID, createCart, deleteAllProducts, deleteProductInCart, getCartByID } from "../controllers/carts.controller.js";

const router = Router()

router.post('/', createCart)

router.get('/:cid', getCartByID)

router.post('/:cid/product/:pid', addToCartByID)

router.delete('/:cid/products/:pid', deleteProductInCart )

router.delete('/:cid', deleteAllProducts)

router.put('/:cid', UpdateAllCart)

router.put('/:cid/products/:pid', UpdateProductQty)


export default router