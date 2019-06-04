"use strict";
const chalk = require("chalk");
const stackStatus = require("./stack_status");

module.exports = status => {
  let formatted = "";

  switch (status) {
    case stackStatus.CREATE_IN_PROGRESS:
      formatted = status;
      break;
    case stackStatus.CREATE_FAILED:
      formatted = chalk`{white.bgRed.bold ${status}}`;
      break;
    case stackStatus.CREATE_COMPLETE:
      formatted = chalk`{green.bold ${status}}`;
      break;
    case stackStatus.DELETE_IN_PROGRESS:
      formatted = status;
      break;
    case stackStatus.DELETE_FAILED:
      formatted = chalk`{white.bgRed.bold ${status}}`;
      break;
    case stackStatus.DELETE_COMPLETE:
      formatted = chalk`{green.bold ${status}}`;
      break;
    case stackStatus.DELETE_SKIPPED:
      formatted = chalk`{white.bgRed.bold ${status}}`;
      break;
    case stackStatus.UPDATE_IN_PROGRESS:
      formatted = chalk`{yellow ${status}}`;
      break;
    case stackStatus.UPDATE_FAILED:
      formatted = chalk`{white.bgRed.bold ${status}}`;
      break;
    case stackStatus.UPDATE_COMPLETE:
      formatted = chalk`{green.bold ${status}}`;
      break;
    case stackStatus.ROLLBACK_IN_PROGRESS:
      formatted = chalk`{cyan ${status}}`;
      break;
    case stackStatus.ROLLBACK_COMPLETE:
      formatted = chalk`{red.bold ${status}}`;
      break;
    case stackStatus.NOT_FOUND:
      formatted = chalk`{red ${status}}`;
      break;
    default:
      formatted = status;
  }

  return formatted;
};
