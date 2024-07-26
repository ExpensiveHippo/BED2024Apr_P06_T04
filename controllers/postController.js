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
const createPost = async (req, res) => {
    const { username, title, content } = req.body;

    try {
        const newPost = await Post.createPost({ username, title, content, industry });
        res.status(201).json({ success: true, message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ success: false, message: "Server error creating post" });
    }
};
const updatePost = async (req, res) => {
    const { title, content, username, postId} = req.body;

    try {
        const newUpdate = await Post.updatePost({title, content, username, postId, industry});
        res.status(201).json({ success: true, message: "Post updated successfully", post: newUpdate });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ success: false, message: "Server error updating post" });
    }
};
const deletePosts = async (req, res) => {
    const {username, postId} = req.body;

    try{
        const newDelete = await Post.deletePosts({username, postId});
        res.status(201).json({ success: true, message: "Post deleted successfully", post: newDelete });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ success: false, message: "Server error deleting post" });
    }
}
module.exports = {
    getAllPosts,
    createPost,
    getPostById,
    updatePost,
    deletePosts
};
