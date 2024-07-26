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
    const userId = req.params.userId; 

    try {
        const comments = await Comments.getCommentsByUser(userId);
        if (comments.length > 0) {
            res.json({ success: true, comments });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, message: "Server error fetching user." });
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
const updateComment = async (req, res) => {
  const bookId = parseInt(req.params.id);
  const newBookData = req.body;

  try {
    const updatedBook = await Book.updateBook(bookId, newBookData);
    if (!updatedBook) {
      return res.status(404).send("Book not found");
    }
    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating book");
  }
};

const deleteComment = async (req, res) => {
    const commentId = parseInt(req.params.id);
    const Smessage = "Comment deleted successfully";
    const Famessage = "Error deleting Comment.";
    try {
      console.log(`Attempting to delete comment with ID: ${commentId}`);
      const success = await Comments.deleteComment(commentId);
      if (!success) {
        console.log(`Comment with ID ${commentId} not found`);
        return res.status(404).send("Comment not found");
      }
      console.log(`Comment with ID ${commentId} deleted successfully`);
      res.status(204).send();
      return Smessage;
    } catch (error) {
      console.error("Error in deleteComment controller:", error);
      res.status(500).send("Error deleting Comment.");
      return Famessage;
    }
};
  
module.exports = {
    getAllComments,
    getCommentsByUser,
    createComment,
    deleteComment,
    updateComment
};
  


