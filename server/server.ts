import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db"
import router from "./router/index"

import { v2 as cloudinary } from "cloudinary"

const app = express()
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", router)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server run on port: ${PORT}`))
