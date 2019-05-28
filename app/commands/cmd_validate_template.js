"use strict";
const chalk = require("chalk");
const { events } = require("../util/events");
const cf = require("../cf_stack");
const s3 = require("../s3");

module.exports = async command => {
  command.emit(events.commandPrompting);
  return new Promise(async (resolve, reject) => {
    try {
      const url = await s3.templateURL();

      command.emit(
        events.commandStarting,
        chalk`{yellow Validating template...}`
      );
      await cf.validateTemplate(url);
      return resolve(console.log(chalk`\n\n{green.bold ✔︎ Template is valid}`));
    } catch (e) {
      return reject(` ✘ ${e.name}: ${e.description}`);
    }
  });
};
