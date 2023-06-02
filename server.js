const express = require("express");
require('dotenv').config()
const mongoose = require("./config/mongoose");
const chalk = require("chalk");
const path = require("path");
const routes = require("./routes");
var expressLayouts = require("express-ejs-layouts");

const PORT = process.env.PORT || 8000;

const app = express();
app.use(expressLayouts);
app.set("layout extractScripts", true)
app.set("layout extractStyles", true)
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("assets"));
app.set("views", path.join(__dirname, "views"));
app.use("/", routes);

app.listen(PORT, (error) => {
  if (error) {
    console.log(chalk.red("Error while setup the server", error));
  }
  console.log(chalk.blueBright("Server Running Successfully ", PORT));
});
