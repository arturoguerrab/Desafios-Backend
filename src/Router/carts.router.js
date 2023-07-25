import { Router } from "express";
import { PurchaseCart, UpdateAllCart, UpdateProductQty, addToCartByID, createCart, deleteAllProducts, deleteProductInCart, getCartByID } from "../controllers/carts.controller.js";
import { UserPass } from "../utils.js";

const router = Router()

router.post('/', createCart)

router.get('/:cid', getCartByID)

router.post('/:cid/product/:pid',UserPass('current'), addToCartByID)

router.delete('/:cid/products/:pid', deleteProductInCart )

router.delete('/:cid', deleteAllProducts)

router.put('/:cid', UpdateAllCart)

router.put('/:cid/products/:pid', UpdateProductQty)

router.post('/:cid/purchase', PurchaseCart)


export default router