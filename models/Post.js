import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
  }, description: {
    type: String,
    required: true,
  }, img: {
    type: String,
    default: ""
  }, likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }, comments: [{
    text: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  }]
}, { timeStamps: true })

export const Post = mongoose.model("Post", postSchema)