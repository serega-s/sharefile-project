import mongoose from "mongoose"

const connOptions = {
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  family: 4,
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, connOptions)
  } catch (err) {
    console.log("ConnectionError", err)
  }

  const db = mongoose.connection
  db.on("error", console.error.bind(console, "MongoDB connection error:"))
}

export default connectDB
