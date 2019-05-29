const workdir = require("./working_dir");
process.env["NODE_CONFIG_DIR"] = workdir() + "/config/";
const config = require("config");

module.exports = exports = config;
