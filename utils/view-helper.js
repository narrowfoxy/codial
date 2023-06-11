const manifest = require("../public/assets/rev-manifest.json");

const changePath = (fileName) => {
  return "/public/assets/" + manifest[fileName];
};

module.exports = changePath;
