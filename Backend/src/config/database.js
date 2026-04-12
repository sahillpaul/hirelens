const mongoose = require("mongoose");

async function connectToDB() {
  try {
    console.log("URI:", process.env.MONGO_URI); // debug
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectToDB;