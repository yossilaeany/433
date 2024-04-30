const mongoose = require("mongoose");
const Joi = require("joi");

// create employee schema object 
const employeeSchema = new mongoose.Schema({
  id: String,
  name: String,
  position: String,
  salary: Number,
//   version - for safe editing
  version:{
    type: Number,
    default: 0
  }
});


exports.employeeModel = mongoose.model("employees", employeeSchema);

// validate the employee schema object
exports.validateEmployee = (_reqBody) => {
    let joiSchema = Joi.object({
        id: Joi.string().min(9).max(9).required(),
        name: Joi.string().min(2).max(20).required(),
        position: Joi.string().min(2).max(30).required(),
        salary: Joi.number().min(2).max(500000).required()
    })
    return joiSchema.validate(_reqBody);
}
