const express = require("express");
const path = require("path");
const http = require("http");

//so two servers can communicate(react and node)
const cors = require("cors");

// contains all the routes
const {routesInit} = require("./routes/configRoutes");
// connect to the db
require("./db/mongoConnect");

const app = express();
app.use(cors());

// sets the server to accept json in the body of the request
app.use(express.json());

// makes the public folder available to the client side - not used - for loging files
app.use(express.static(path.join(__dirname,"public")));

// function that defines all the temporary routes in the application
routesInit(app);

// sets the server to listen on port 3005 or the port defined by the environment
const server = http.createServer(app);
let port = process.env.PORT || 3005;
server.listen(port);