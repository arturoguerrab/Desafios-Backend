import { Router } from "express";
import { SendMessage, renderMessages } from "../controllers/messages.controller.js";

const router = Router()

router.get('/', renderMessages)

router.post('/', SendMessage )

export default router