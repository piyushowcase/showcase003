 import express from "express"
import isAuth from "../middleware/isAuth.js"
import { generateNotes } from "../controlers/generate.controller.js"
import userRouter from "./user.route.js"
import { getMyNotes, getSingleNotes } from "../controlers/notes.controller.js"

const notesRouter = express.Router()

notesRouter.post("/generate-notes",isAuth,generateNotes)
notesRouter.get("/getnotes",isAuth,getMyNotes)
notesRouter.get("/:id",isAuth,getSingleNotes)

export default notesRouter