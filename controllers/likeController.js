const Like = require("../models/like");

const createLike = async (req, res) => {
    const user = req.user;
    const body = req.body;
    
    try {
        const result = await Like.createLike(user, body);
        res.status(201).json(result);
    } 
    catch (error) {
        console.error(error);
        res.status(500).send("Error adding like");
    }
}

const deleteLike = async (req, res) => {
    const body = req.body;
    const user = req.user;

    try {
        const success = await Like.deleteLike(user, body);
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

const getLike = async (req, res) => {
    const user = req.user;
    const contentType = req.params.contentType;
    const contentId = parseInt(req.params.contentId);

    try {
        const like = await Like.getLike(user, contentType, contentId);
        res.json(like);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving like");
    }
}

const getLikesForContent = async (req, res) => {
    const contentType = req.params.type;
    const contentId = parseInt(req.params.id);

    try {
        const likes = await Like.getLikesForContent(contentType, contentId);
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
    getLike,
    getLikesForContent,
    getLikesOfUser
};