"use strict";
const { get } = require("./index");

module.exports = exports = () => {
  return get() === "prod";
};
