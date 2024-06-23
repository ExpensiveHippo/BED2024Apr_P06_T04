const Like = require("../models/like");

const createLike = async (req, res) => {
    const newLike = req.body;
    
    try {
        const result = await Like.createLike(newLike);
        res.status(201).json(result);
    } 
    catch (error) {
        console.error(error);
        res.status(500).send("Error adding like");
    }
}

const deleteLike = async (req, rest) => {
    const thisLike = req.body;

    try {
        const success = await Like.deleteLike(thisLike);
        if (!success) {
            res.status(404).send("Like not found");
        }
        else {
            res.status(204).send();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error deleting like");
    }
}

const getLikesForPost = async (req, res) => {
    const postId = parseInt(req.params.id);

    try {
        const likes = await Like.getLikesForPost(postId);
        res.json(likes);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving likes for post");
    }
}

const getLikesOfUser = async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const likes = await Like.getLikesOfUser(userId);
        res.json(likes);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving likes of user");
    }
}

module.exports = {
    createLike,
    deleteLike,
    getLikesForPost,
    getLikesOfUser
};