module.exports = app => {
  const mongoose = app.mongoose

  const UserSchema = new mongoose.Schema({
    userName: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ""
    },
    createAt: {
      type: Date,
      default: Date.now
    }
  })

  return mongoose.model('UserSchema', UserSchema)
}