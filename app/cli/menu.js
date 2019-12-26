"use strict";
const EventEmitter = require("events");
const { events } = require("../util/events");
const inquirer = require("inquirer");
const clear = require("clear");
const chalk = require("chalk");
const ui = require("cliui")();
const metadata = require("../stack_metadata");
const environment = require("../environment");
const Commands = require("./commands_facade");
const commands = new Commands();
const prompt = {
  type: "list",
  name: "command",
  message: "Select command",
  choices: commands.asChoices()
};

function showInfo(stackName) {
  ui.resetOutput();
  console.log(ui.toString() + "\n");
  const w1 = 18;
  const w2 = 120;
  const padding = [0, 0, 0, 1];
  const data = [
    { label: "Stack Name", value: stackName },
    { label: "Environment", value: environment.get() }
  ];
  data.map(entry => {
    ui.div(
      {
        text: chalk`   {yellow.bold ${entry.label}}`,
        width: w1,
        padding: padding
      },
      {
        text: entry.value,
        width: w2,
        padding: padding
      }
    );
  });

  console.log(ui.toString() + "\n");
}

class Menu extends EventEmitter {
  async fetchStackInfo() {
    const meta = await metadata.getFileData();
    return meta.name;
  }

  show(stackName) {
    clear();
    const _this = this;
    showInfo(stackName);
    inquirer.prompt(prompt).then(function(choice) {
      _this.emit(events.commandChosed, choice.command);
    });
  }
}

module.exports = Menu;
