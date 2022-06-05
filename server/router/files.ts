import express from "express"
import { UploadApiResponse, v2 as cloudinary } from "cloudinary"
import multer from "multer"
import File from "../models/File"

const router = express.Router()

const storage = multer.diskStorage({})
let upload = multer({
  storage,
})

router.get("/", (req, res) => {
  return res.json({ message: "GET" })
})

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Selected file must be uploaded" })

    let uploadedFile: UploadApiResponse
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "sharefilemedia",
        resource_type: "auto",
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({ message: "Cloudinary Error" })
    }

    const { originalname } = req.file
    const { secure_url, bytes, format } = uploadedFile

    const file = await File.create({
      filename: originalname,
      sizeInBytes: bytes,
      secure_url,
      format,
    })
    res.status(200).json({
      id: file.id,
      downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}/api/files/download/${file._id}`,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" })
  }
})

export default router
