import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary'

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    console.log(posts);
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    let { img } = req.body;

    const userId = req.user?._id?.toString();
    const user = await User.findById(userId);

    if (!user) return res.status(401).json({ error: "User not found" });
    if (!title && !img) {
      return res.status(400).json({ error: "Post must have the text or image" });
    }

    // If image is a base64 string (not an external URL), upload to Cloudinary
    if (img && !img.startsWith('http')) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({ user: userId, title, description, img });
    await newPost.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate({ path: "user", select: "-password" });

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const editpost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, img } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to edit this post" });
    }

    post.title = title || post.title;
    post.description = description || post.description;
    post.img = img || post.img;

    await post.save();

    const updatedPost = await Post.findById(id)
      .populate({ path: "user", select: "-password" });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete this post" });
    }

    if (post.img && !post.img.includes("unsplash.com")) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
