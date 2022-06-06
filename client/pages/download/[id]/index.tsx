import RenderFile from "@components/RenderFile"
import axios from "axios"
import { IFile } from "libs/types"
import fileDownload from "js-file-download"
import { GetServerSidePropsContext, NextPage } from "next"
import React from "react"

const index: NextPage<{ file: IFile }> = ({ file }) => {
  const handleDownload = async () => {
    const { data } = await axios.get(`api/files/${file.id}/download`, {
      responseType: "blob",
    })
    fileDownload(data, file.name)
  }
  return (
    <div className="flex flex-col items-center justify-center py-3 space-y-4 bg-gray-800 rounded-md shadow-xl w-96">
      {!file.id ? (
        <span>File does not exist, check the URL.</span>
      ) : (
        <>
          <img
            src="/images/file-download.png"
            alt="Download"
            className="w-16 h-16"
          />
          <h1 className="text-xl">Your file is ready to downloading.</h1>
          <RenderFile file={file} />
          <button className="button" onClick={handleDownload}>
            Download
          </button>
        </>
      )}
    </div>
  )
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query
  let file
  try {
    const { data } = await axios.get(`/api/files/${id}`)
    file = data
  } catch (err) {
    console.log(err)
    file = {}
  }
  return {
    props: {
      file,
    },
  }
}

export default index
