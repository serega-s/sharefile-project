import DropZoneComponent from "components/DropZoneComponent"
import { NextPage } from "next"
import { useState } from "react"

const Home: NextPage = () => {
  const [file, setFile] = useState(null)
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="my-4 text-3xl font-medium">
        Got a File? Share it with friends
      </h1>
      <div className="w-96 flex flex-col items-center bg-gray-800 rounded-xl justify-center shadow-xl">
        <DropZoneComponent setFile={setFile} />
      </div>
      {/* Render Zone */}
      {file?.name}
      {/* Upload Button */}
    </div>
  )
}

export default Home
