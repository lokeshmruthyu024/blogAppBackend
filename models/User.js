import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  }, password: {
    type: String,
    required: true,
    minLength: 6
  }, email: {
    type: String,
    required: true,
    unique: true
  },
}, { timestamps: true })

export const User = mongoose.model("User", userSchema);