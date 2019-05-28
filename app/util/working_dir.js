"use strict";
const path = require("path");
const config = require("config");

module.exports = exports = function() {
  let _workdir = "";
  let envWorkdir = undefined;

  try {
    envWorkdir = config.get("app.workingDir");
  } catch (e) {}

  if (envWorkdir) {
    _workdir = path.resolve(__dirname + "/../../" + envWorkdir);
  } else {
    _workdir = path.resolve(process.cwd());
  }

  return _workdir;
};
