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
  const userId = parseInt(req.params.userId); 

  try {
      const comments = await Comments.getCommentsByUser(userId);
      if (comments.length > 0) {
          res.json({ success: true, comments });
      } else {
          res.status(404).json({ success: false, message: "No comments found for this user" });
      }
  } catch (error) {
      console.error("Error fetching comments by user:", error);
      res.status(500).json({ success: false, message: "Server error fetching comments" });
  }
};


const createComment = async (req, res) => {
    const newComment = req.body;

    try {
        if (!newComment.userId || !newComment.contentType || !newComment.contentId || !newComment.content) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const result = await Comments.createComment(newComment);
        res.status(201).json({ success: true, comment: result });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ success: false, message: "Error creating comment" });
    }
};

const updateComment = async (req, res) => {
  const commentId = parseInt(req.params.id);
  const { content } = req.body;

  if (!commentId || !content) {
      return res.status(400).json({ success: false, message: "Comment ID and content are required" });
  }

  try {
      const updatedComment = await Comments.updateComment(commentId, content);

      if (updatedComment) {
          res.status(200).json({
              success: true,
              message: "Comment updated successfully"
          });
      } else {
          res.status(404).json({ success: false, message: "Comment not found or not updated" });
      }
  } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ success: false, message: "Server error updating comment" });
  }
};

const deleteComment = async (req, res) => {
    const commentId = parseInt(req.params.id);

    try {
        const success = await Comments.deleteComment(commentId);
        if (!success) {
            return res.status(404).send("Comment not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).send("Error deleting comment");
    }
};

module.exports = {
    getAllComments,
    getCommentsByUser,
    createComment,
    updateComment,
    deleteComment
};
