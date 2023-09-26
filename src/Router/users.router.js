import { Router } from "express";
import { changeUserRol, getUsers, redirectVerifyToken, resetPassword, sendMailForgetPassword } from "../controllers/users.controller.js";

const router = Router()

router.get('/premium/:uid', changeUserRol )

router.get('/', getUsers )

router.post('/forget-password', sendMailForgetPassword )

router.get('/reset-password/:token', redirectVerifyToken)

router.post('/reset-password/:user', resetPassword)


export default router