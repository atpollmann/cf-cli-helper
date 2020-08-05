const environment = require("../environment").get();

module.exports = exports =
  require("../util/working_dir")() +
  "/stack_parameters." +
  environment +
  ".json";
