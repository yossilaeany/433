require('dotenv').config();
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const myToken = process.env.ADMIN_TOKEN;

// creat schema for admin application
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    date_created: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "admin"
    }
});


exports.UserModel = mongoose.model("users", userSchema);

// function to create token - Valid for 5 hours
exports.createToken = (user_id, role) => {
    let token = jwt.sign({ _id: user_id, role: role }, myToken, { expiresIn: "300mins" })
    return token;
}

// checks if input is valid and not mailcious use - not used
// exports.validateUser = (_reqBody) => {
//     let joiSchema = Joi.object({
//         name: Joi.string().min(2).max(50).required(),
//         email: Joi.string().min(2).max(50).email().required(),
//         password: Joi.string().min(8).max(50).required()
//     })
//     return joiSchema.validate(_reqBody);
// }

// checks if input is valid and not mailcious use
exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(50).email().required(),
        password: Joi.string().min(3).max(50).required()
    })
    return joiSchema.validate(_reqBody);
}