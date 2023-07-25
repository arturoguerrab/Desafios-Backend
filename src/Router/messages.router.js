import { Router } from "express";
import { SendMessage, renderMessages } from "../controllers/messages.controller.js";
import { UserPass } from "../utils.js";

const router = Router()

router.get('/', UserPass('current'), renderMessages)

router.post('/', SendMessage )

export default router