"use strict";
const chalk = require("chalk");
const { events } = require("../util/events");
const stage = require("../stage");
const cf = require("../cf_stack");
const metadata = require("../stack_metadata");
const main = require("../main_template");
const parameters = require("../template_parameters");
const s3 = require("../s3");

module.exports = async command => {
  command.emit(events.commandPrompting);
  return new Promise(async (resolve, reject) => {
    const savedStage = await stage.getSavedStage();
    if (
      savedStage === stage.stages.DEPLOYING_STACK ||
      savedStage === stage.stages.DELETING_STACK
    ) {
      reject(`Cant deploy stack. Stack status: ${savedStage}`);
    } else {
      try {
        const template = await main.getTemplate();
        const meta = await metadata.getFileData();
        const params = await parameters.getParameters();
        const url = await s3.templateURL();

        cf.checkParameters(template, params);

        command.emit(
          events.commandStarting,
          chalk`{yellow Validating template...}`
        );
        await cf.validateTemplate(url);

        command.emit(events.commandStarting, chalk`{yellow Creating stack...}`);
        await cf.createStack(meta.name, url, params);

        return resolve(
          console.log(chalk`\n\n{green.bold ✔︎ Stack creation command issued}`)
        );
      } catch (e) {
        return reject(`${e.name}: ${e.description}`);
      }
    }
  });
};
