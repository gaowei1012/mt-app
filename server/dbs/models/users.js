import mongoose from 'mongoose'
const Schmea = mongoose.Schema

const UserSchmea = new Schmea({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})

export default mongoose.model('User', UserSchmea)
