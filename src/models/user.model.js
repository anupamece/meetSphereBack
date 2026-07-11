
import mongoose , { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['attendee', 'organizer', 'admin'], default: 'attendee' },
  avatar: { type: String },
  phone: { type: String },
  refreshToken: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 10)
  next();
})

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.genrateAccessToken = function() {
  return jwt.sign({
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role
  },
   process.env.JWT_SECRET,
  {expiresIn : '6h'},
  )
}
userSchema.methods.genrateRefreshToken = function() {
  return jwt.sign({
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role
  },
   process.env.JWT_SECRET,
  {expiresIn : '2d'},
  )
}


export const User = mongoose.model("User", userSchema);