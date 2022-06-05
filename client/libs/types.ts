export interface IFile {
  name: string
  sizeInBytes: number
  format: string
  id?: string
}

export enum UploadStateTypes {
  UPLOADING = "Uploading",
  UPLOAD_FAILED = "Upload Failed",
  UPLOADED = "Uploaded",
  UPLOAD = "Upload",
}
