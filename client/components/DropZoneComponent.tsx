import { useDropzone } from "react-dropzone"

import React, { Dispatch, useCallback } from "react"

interface DropZoneComponentProps {
  setFile: Dispatch<any>
}

const DropZoneComponent: React.FC<DropZoneComponentProps> = ({ setFile }) => {
  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
        "audio/*": [".mp3"],
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
      },
    })

  return (
    <div className="p-4 w-full">
      <div
        {...getRootProps()}
        className="w-full h-80 rounded-md cursor-pointer focus:outline-none"
      >
        <input {...getInputProps()} />
        <div
          className={
            "flex flex-col items-center justify-center border-2 border-dashed border-yellow-light rounded-xl h-full space-y-3 " +
            (isDragReject ? "border-red-500" : "") +
            (isDragAccept ? "border-green-500" : "")
          }
        >
          <img src="/images/folder.png" alt="folder" className="h-16 w-16" />

          {isDragReject ? (
            <p>Sorry, the app only supports images and audios</p>
          ) : (
            <>
              <p>Drag & Drop Files Here</p>
              <p className="mt-2 text-base text-gray-300">
                Only JPEG, PNG, MP3, PDF & DOC supported
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DropZoneComponent
