import { sizeInMb } from "libs/sizeInMb"
import { IFile } from "libs/types"
import React from "react"

interface RenderFileProps {
  file: IFile
}

const RenderFile: React.FC<RenderFileProps> = ({ file }) => {
  console.log(file)
  return (
    <div className="flex items-center w-full p-4 my-2">
      <img
        src={`/images/${file.format}.png`}
        alt="format"
        className="w-14 h-14"
      />
      <span className="mx-2">{file.name}</span>
      <span className="ml-auto">{sizeInMb(file.sizeInBytes)}</span>
    </div>
  )
}

export default RenderFile
