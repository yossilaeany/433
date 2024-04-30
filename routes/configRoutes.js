const indexR = require("./index");
const usersR = require("./users");
const employeesR = require("./employees");




exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/employees",employeesR);
  app.use("*",(req,res) => {
    res.status(404).json({msg:"Page/endpoint not found, 404"})
  });
}