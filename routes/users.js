const express = require("express");
const bcrypt = require("bcrypt");
const { authAdmin } = require("../middlewares/auth");
const { UserModel, validateUser, validateLogin, createToken } = require("../models/userModel");

// create a router object to handle the routes
const router = express.Router();

// listen to the home page route as set in the config file
router.get("/", async (req, res) => {
  res.json({ msg: "Users endpoint" });
})

// rout to check the token validity including the user
// role without talking to the database
// router.get("/checkToken", auth,async(req,res) => {
//   try{
//     res.json(req.tokenData);
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })


// rout to get all users in the database only for the admin
router.get("/usersList", authAdmin, async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 20;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id"
  let reverse = req.query.reverse == "yes" ? 1 : -1

  try {
    let data = await UserModel
      .find({})
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


// rout to get the user info
router.get("/userInfo", authAdmin, async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
    res.json(user);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})




// sign up - not using
// router.post("/signUp", async(req,res) => {
//   let validBody = validateUser(req.body);
//   if(validBody.error){
//     return res.status(400).json(validBody.error.details);
//   }
//   try{
//     let user = new UserModel(req.body);

//     // incrypt the password useing bcrypt crypting level 10
//     user.password = await bcrypt.hash(user.password, 10);
//     await user.save();

//     // not to send the password to the client
//     user.password = "***"
//     res.json(user);
//   }
//   catch(err){
//     if(err.code == 11000){
//       return res.status(400).json({msg:"Email already in system",code:11000})
//     }
//     console.log(err);
//     res.status(502).json({err})
//   }
// })

// log in for admin
router.post("/logIn", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // checks if the email exists in the database
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: "Email Wrong." })
    }
  
    // checks if the password is correct
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "Password Wrong." })
    }
    // if valid, user gets token
    let token = createToken(user._id, user.role)
    // res.json({token:token})
    res.json({ token, role: user.role })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

// 
router.patch("/changeRole/:id/:role", authAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const newRole = req.params.role;

    // prevent admin from changing his role or the super admin 
    // and the super admin rule needs to be hardcoded

    // remmber replace superadminIDInDB !!!!!!!
    if (id == req.tokenData._id || id == "superadminIDInDB") {
      return res.status(401).json({ err: "You cant change your user role or the super admin" })
    }
    // creat a new admin - opptionally
    const data = await UserModel.updateOne({ _id: id }, { role: newRole })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

module.exports = router;