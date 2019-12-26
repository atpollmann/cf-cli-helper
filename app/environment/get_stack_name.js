"use strict";
const environment = require("./index");

module.exports = exports = stackName => {
  return environment.get() + "-" + stackName;
};
