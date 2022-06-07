import axios from "axios"
import React, { useState } from "react"

interface EmailFormProps {
  id: string
}

const EmailForm: React.FC<EmailFormProps> = ({ id }) => {
  const [emailFrom, setEmailFrom] = useState("")
  const [emailTo, setEmailTo] = useState("")
  const [message, setMessage] = useState(null)

  const handleEmail = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post("api/files/email/", {
        id,
        emailFrom,
        emailTo,
      })

      setMessage(data.message)
    } catch (err) {
      setMessage(err.data.response.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-2 space-y-3">
      <h3>You can also send the file through email</h3>
      <form
        onSubmit={handleEmail}
        className="flex flex-col items-center justify-center w-full p-2 space-y-3"
      >
        <input
          type="email"
          className="p-1 text-white bg-gray-800 border-2 focus:outline-none"
          placeholder="Email From"
          onChange={(e) => setEmailFrom(e.target.value)}
          value={emailFrom}
          required
        />
        <input
          type="email"
          className="p-1 text-white bg-gray-800 border-2 focus:outline-none"
          placeholder="Email To"
          onChange={(e) => setEmailTo(e.target.value)}
          value={emailTo}
          required
        />
        <button type="submit" className="button">
          Email
        </button>
      </form>
      {message && <p className="font-medium text-red-500">{message}</p>}
    </div>
  )
}

export default EmailForm
