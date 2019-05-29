"use strict";
const path = require("path");

module.exports = exports = function() {
  let _workdir = "";
  let env = process.env.NODE_ENV;
  let envWorkdir = process.env.CF_CLI_WORKING_DIR;

  if (env && /^dev.*/.test(env)) {
    if (envWorkdir) {
      _workdir = path.resolve(__dirname + "/../../" + envWorkdir);
    } else {
      _workdir = path.resolve(__dirname + "/../../dev/dev_workdir");
    }
  } else {
    _workdir = path.resolve(process.cwd());
  }

  return _workdir;
};
