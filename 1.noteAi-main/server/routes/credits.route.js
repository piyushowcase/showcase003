import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createCreditsOrder } from "../controlers/credits.controller.js"

const creditsRouter = express.Router()

creditsRouter.post("/order", isAuth, createCreditsOrder)

export default creditsRouter;
