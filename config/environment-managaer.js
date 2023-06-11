const developmemtConfig = require("./development.config");
const productionConfig = require("./production.config");

module.exports =
  process.env.NODE_ENV == "production" ? productionConfig : developmemtConfig;
