import express from "express"
import { UploadApiResponse, v2 as cloudinary } from "cloudinary"
import multer from "multer"
import File from "../models/File"
import nodemailer from "nodemailer"

import https from "https"
import emailTemplate from "../assets/emailTemplate"

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
      downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}/download/${file._id}/`,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id
    const file = await File.findById(id)

    if (!file) {
      return res.status(404).json({ message: "File does not exist" })
    }

    const { filename, format, sizeInBytes } = file

    res.status(200).json({ name: filename, sizeInBytes, format, id })
  } catch (err) {
    res.status(500).json({ message: "Server Error" })
  }
})

router.get("/:id/download", async (req, res) => {
  try {
    const id = req.params.id
    const file = await File.findById(id)

    if (!file) {
      return res.status(404).json({ message: "File does not exist" })
    }

    https.get(file.secure_url, (fileStream) => fileStream.pipe(res))
  } catch (err) {
    res.status(500).json({ message: "Server Error" })
  }
})

router.post("/email", async (req, res) => {
  const { id, emailFrom, emailTo } = req.body

  const file = await File.findById(id)

  if (!file) {
    return res.status(404).json({ message: "File does not exist" })
  }

  let transporter = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.SENDINBLUE_SMTP_HOST!, // "smtp.ethereal.email"
    port: process.env.SENDINBLUE_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SENDINBLUE_SMTP_USER, // generated ethereal user
      pass: process.env.SENDINBLUE_SMTP_PASSWORD, // generated ethereal password
    },
  })

  const { filename, sizeInBytes } = file
  const fileSize = `${(Number(sizeInBytes) / (1024 * 1024)).toFixed(2)} MB`
  const downloadPageLink = `${process.env.API_BASE_ENDPOINT_CLIENT}/download/${file._id}/`

  const mailOptions = await transporter.sendMail({
    from: emailFrom, // sender address
    to: emailTo, // list of receivers
    subject: "File shared with you", // Subject line
    text: `${emailFrom} shared a file with you`, // plain text body
    html: emailTemplate(emailFrom, downloadPageLink, fileSize, filename),
  })

  await transporter.sendMail(mailOptions, async (err, info) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ message: "Server Error" })
    }
    file.sender = emailFrom
    file.receiver = emailTo

    await file.save()
    res.status(200).json({ message: "Email Sent" })
  })
})

export default router
