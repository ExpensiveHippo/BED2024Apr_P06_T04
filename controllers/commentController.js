const Comments = require("../models/comment");

const getAllComments = async (req, res) => {
    try {
        const comments = await Comments.getAllComments();
        res.json({ success: true, comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, message: "Server error fetching comments" });
    }
};

const getCommentsByUser = async (req, res) => {
    const userId = req.params.userId; // Corrected to userId

    try {
        const comments = await Comments.getCommentsByUser(userId);
        if (comments.length > 0) {
            res.json({ success: true, comments });
        } else {
            res.status(404).json({ success: false, message: "Comments not found" });
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, message: "Server error fetching comments" });
    }
};

const createComment = async (req, res) => {
    const { postId, userId, comment, liked } = req.body;

    try {
        const newComment = await Comments.createComment(postId, userId, comment, liked);
        res.status(201).json({ success: true, message: "Comment created successfully", commentId: newComment.commentId, comment: newComment.comment });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ success: false, message: "Server error creating comment" });
    }
};

module.exports = {
    getAllComments,
    getCommentsByUser,
    createComment
};