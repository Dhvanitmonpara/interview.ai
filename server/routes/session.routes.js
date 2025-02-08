import { Router } from "express";
import {
    createSession,
    updateSession,
    deleteSession,
    getSession
} from "../controllers/session.controller.js";

const router = Router()

router.route('/').post(createSession).delete(deleteSession).patch(updateSession).get(getSession)

export default router;