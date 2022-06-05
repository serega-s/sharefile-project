import DownloadFile from "@components/DownloadFile"
import RenderFile from "@components/RenderFile"
import axios from "axios"
import DropZoneComponent from "components/DropZoneComponent"
import { UploadStateTypes } from "libs/types"
import { NextPage } from "next"
import { useState } from "react"

const Home: NextPage = () => {
  const [file, setFile] = useState(null)
  const [id, setId] = useState(null)
  const [downloadPageLink, setDownloadPageLink] = useState(null)
  const [uploadState, setUploadState] = useState<UploadStateTypes>(
    UploadStateTypes.UPLOAD
  )

  const handleUpload = async () => {
    if (uploadState === UploadStateTypes.UPLOADING) return
    setUploadState(UploadStateTypes.UPLOADING)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const { data } = await axios.post("api/files/upload", formData)
      setUploadState(UploadStateTypes.UPLOADED)
      setDownloadPageLink(data.downloadPageLink)
      setId(data.id)
    } catch (err) {
      console.log(err.message)
      setUploadState(UploadStateTypes.UPLOAD_FAILED)
    }
  }

  const resetComponent = () => {
    setFile(null)
    setDownloadPageLink(null)
    setUploadState(UploadStateTypes.UPLOAD)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="my-4 text-3xl font-medium">
        Got a File? Share it with friends
      </h1>
      <div className="w-96 flex flex-col items-center bg-gray-800 rounded-xl justify-center shadow-xl">
        {!downloadPageLink && <DropZoneComponent setFile={setFile} />}

        {/* Render Zone */}
        {file && (
          <RenderFile
            file={{
              format: file.type.split("/")[1],
              name: file.name,
              sizeInBytes: file.size,
            }}
          />
        )}

        {/* Upload Button */}
        {!downloadPageLink && file && (
          <button
            className="w-44 bg-gray-900 my-5 p-2 rounded-md focus:outline-none"
            onClick={handleUpload}
          >
            {uploadState}
          </button>
        )}

        {downloadPageLink && (
          <div className="p-2 text-center">
            <DownloadFile downloadPageLink={downloadPageLink} />
            {/* Email Form */}
            <button
              className="w-44 bg-gray-900 my-5 p-2 rounded-md focus:outline-none"
              onClick={resetComponent}
            >
              Upload New File
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
