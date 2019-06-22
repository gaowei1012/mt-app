import mongoose from 'mongoose'
const Schmea = mongoose.Schema

const UserSchmea = new Schmea({
  username:{
    type:String,
    unique:true,
    require:true
  },
  password:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true
  }
})

export default mongoose.model('User', UserSchmea)
