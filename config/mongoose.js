const chalk = require("chalk");
const mongoose = require("mongoose");
const env = require("./environment-managaer");

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log(chalk.yellowBright("Successfully connected to the Database"));
  } catch (err) {
    console.log(chalk.redBright("Error while connecting to Database", err));
  }
}

module.exports = mongoose.connection;