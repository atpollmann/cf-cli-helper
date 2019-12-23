"use strict";
const chalk = require("chalk");
const { events } = require("../util/events");
const stage = require("../stage");
const cf = require("../cf_stack");
const metadata = require("../stack_metadata");
const main = require("../main_template");
const parameters = require("../template_parameters");
const s3 = require("../s3");
const inquirer = require("inquirer");
const environment = require("../environment");

function createStack(command) {
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
        const allParams = { ...meta, ...params };

        cf.checkParameters(template, params);
        cf.checkMetadata(meta);

        command.emit(
          events.commandStarting,
          chalk`{yellow Validating template...}`
        );
        await cf.validateTemplate(url);

        command.emit(events.commandStarting, chalk`{yellow Creating stack...}`);
        await cf.createStack(meta.name, url, allParams);

        return resolve(
          console.log(chalk`\n\n{green.bold ✔︎ Stack creation command issued}`)
        );
      } catch (e) {
        return reject(`${e.name}: ${e.description}`);
      }
    }
  });
}

module.exports = async command => {
  command.emit(events.commandPrompting);
  if (environment.stackCreateConfirmation()) {
    return inquirer
      .prompt([
        {
          type: "confirm",
          name: "create",
          message: chalk`{red You are in PRODUCTION mode. Please confirm the creation of the stack}`,
          default: false
        }
      ])
      .then(async answers => {
        if (answers.create) {
          await createStack(command);
        }
      });
  } else {
    return createStack(command);
  }
};
