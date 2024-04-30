require('dotenv').config();
const jwt = require("jsonwebtoken");
const myToken = process.env.ADMIN_TOKEN;

// auth for admin only
exports.authAdmin = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({msg:"You must send token in the header to this endpoint"})
  }
  try{
    //checks if token is valid or expired
    let decodeToken = jwt.verify(token, myToken);
    // checks if user is admin
    if(decodeToken.role != "admin"){
      return res.status(401).json({msg:"Just admin can be in this endpoint"})
    }
    req.tokenData = decodeToken;  
    next();
  }
  catch(err){
    return res.status(401).json({msg:"Token invalid or expired"})
  }

  // auth for all endpoints - not used
// exports.auth = (req,res,next) => {
//   let token = req.header("x-api-key");
//   if(!token){
//     return res.status(401).json({msg:"You must send token in the header to this endpoint"})
//   }
//   try{
//     //checks if token is valid or expired
//     let decodeToken = jwt.verify(token, myToken);
//     req.tokenData = decodeToken;
//     next();
//   }
//   catch(err){
//     return res.status(401).json({msg:"Token invalid or expired"})
//   }
// }

}