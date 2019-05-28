"use strict";
const chalk = require("chalk");
const clear = require("clear");
const inquirer = require("inquirer");
const ora = require("ora");

const Menu = require("./menu");
const { events } = require("../util/events");
const Commands = require("./commands_facade");
const commands = new Commands();
const menu = new Menu();

const spinner = ora({
  spinner: "arc",
  color: "green"
});

menu.on(events.commandChosed, async function(choice) {
  try {
    await commands.run(choice);
  } catch (e) {
    spinner.stop();
    console.log(chalk`\n\n{red.bold ERROR: }{red ${e}}`);
  }
});

commands.on(events.commandStarting, function(text) {
  if (text) spinner.text = text;
  else spinner.text = chalk`{green Fetching data\n\n}`;
  spinner.start();
});

commands.on(events.commandPrompting, function() {
  spinner.stop();
});

commands.on(events.commandFinished, function() {
  spinner.stop();
  inquirer
    .prompt({
      type: "input",
      name: "command",
      prefix: "",
      message: "\n\nPress enter to continue..."
    })
    .then(() => {
      clear();
      menu.show();
    });
});

menu.show();
