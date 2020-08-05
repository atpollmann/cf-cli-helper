"use strict";
const config = require("../util/config");
require("dotenv").config({ debug: true });

module.exports = exports = () =>
  process.env.ENVIRONMENT ? process.env.ENVIRONMENT : "dev";
