const Joi = require("joi");

const validateUser = (req, res, next)=> {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(8).max(50).required(),
        bio: Joi.string().max(255),
        link: Joi.string().max(255),
    })
    const validation = schema.validate(req.body, {abortEarly:true});
    if(validation.error){
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({message: "Validation error", errors});
        return;
    }
    next();
};

module.exports = validateUser;