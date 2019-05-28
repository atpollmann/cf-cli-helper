"use strict";
const EventEmitter = require("events");
const { events } = require("../util/events");
const inquirer = require("inquirer");
const clear = require("clear");

const Commands = require("./commands_facade");
const commands = new Commands();
const prompt = {
  type: "list",
  name: "command",
  message: "Select command",
  choices: commands.asChoices()
};

class Menu extends EventEmitter {
  show() {
    clear();
    const _this = this;
    inquirer.prompt(prompt).then(function(choice) {
      _this.emit(events.commandChosed, choice.command);
    });
  }
}

module.exports = Menu;
