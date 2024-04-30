require('dotenv').config();
const mongoose = require('mongoose');


main().catch(err => console.log(err));


async function main() {

  mongoose.set('strictQuery', false);

// connect to the database
  await mongoose.connect("mongodb://localhost:27017/lahav433");
  console.log("mongo connect lahav433 db");
}