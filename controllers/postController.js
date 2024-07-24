const Post = require("../models/post");

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPost(); // Fetching from the database
        res.json({ success: true, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, message: "Server error fetching posts" });
    }
};
const createPost = async (req, res) => {
    const { username, title, content } = req.body;

    try {
        const newPost = await Post.createPost({ username, title, content });
        res.status(201).json({ success: true, message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ success: false, message: "Server error creating post" });
    }
};
const getPostById = async (req, res) => {
    const postId = req.params.postId; // Assuming postId is passed as a route parameter

    try {
        const post = await Post.getPostById(postId);
        if (post) {
            res.json({ success: true, post });
        } else {
            res.status(404).json({ success: false, message: "Post not found" });
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ success: false, message: "Server error fetching post" });
    }
};
module.exports = {
    getAllPosts,
    createPost,
    getPostById
};
