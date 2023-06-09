const express = require("express");
require("dotenv").config();
const env = require("./config/environment-managaer");
const mongoose = require("./config/mongoose");
const session = require("express-session");
const chalk = require("chalk");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJwt = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-strategy");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");
const { compileSass, compileAllSassFiles } = require("./utils/node-sass");
const chokidar = require("chokidar");
const connectFlash = require("connect-flash");
const customMware = require("./config/middleware");
const cors = require("cors");
const socket = require("./config/socket.js");
const viewHelper = require("./utils/view-helper");
const morgan = require("morgan");
const fs = require("fs");
const rfs = require("rotating-file-stream");
const PORT = env.PORT || 8000;
const app = express();
app.locals.manifest = viewHelper;
if (env.ENV == "production") {
  const accessLogStream = rfs.createStream(__dirname + "/logs/" + "access.log", {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip" // compress rotated files
  });
  app.use(morgan({ stream: accessLogStream }));
} else {
  app.use(morgan("dev")); //log to console on development
}
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    name: "codial",
    secret: env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: mongoose,
        autoRemove: "disabled",
      },
      function (err) {
        if (err) {
          console.log(err);
        }
        console.log("connected to mongo store");
      }
    ),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(connectFlash());
app.use(customMware.setFlash);

app.use(expressLayouts);
app.use(express.static("assets"));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(
  "/public/assets",
  express.static(path.join(__dirname, "/public/assets"))
);
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
const node_sass = compileAllSassFiles();

chokidar.watch("./assets/scss").on("change", (filePath) => {
  console.log(`Sass file ${filePath} changed. Recompiling...`);
  compileSass(filePath);
});

const routes = require("./routes");

app.use("/", routes);

app.listen(PORT, (error) => {
  if (error) {
    console.log(chalk.red("Error while setup the server", error));
  }
  console.log(chalk.blueBright("Server Running Successfully ", PORT));
});
