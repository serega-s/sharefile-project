import express from "express"
import filesRouter from "./files"

const router = express.Router()

router.use("/files", filesRouter)

export default router
