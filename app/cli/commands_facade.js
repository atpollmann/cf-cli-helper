"use strict";
const EventEmitter = require("events");
const { events } = require("../util/events");
const commands = require("../commands");
const chalk = require("chalk");

const commandsMap = {
  CMD_SHOW_INFO: {
    caption: "Show stack info",
    controller: "showStackInfo"
  },
  CMD_SHOW_EVENTS: {
    caption: "Show stack events",
    controller: "showStackEvents"
  },
  CMD_S3_UPLOAD: {
    caption: "Upload template to S3",
    controller: "uploadTemplateToS3"
  },
  CMD_VALIDATE_TEMPLATE: {
    caption: "Validate template in AWS",
    controller: "validateTemplate"
  },
  CMD_DEPLOY_STACK: {
    caption: "Create stack in AWS",
    controller: "createStack"
  },
  EXIT: {
    caption: "Exit",
    controller: "exit"
  }
};

class CommandsFacade extends EventEmitter {
  asChoices() {
    return Object.keys(commandsMap).map(k => ({
      name: commandsMap[k].caption,
      value: k
    }));
  }

  async run(key) {
    this.emit(events.commandStarting);
    try {
      await commands[commandsMap[key].controller](this);
    } catch (e) {
      console.log(chalk`\n\n{red.bold ERROR: }{red ${e}}`);
    }
    this.emit(events.commandFinished);
  }
}

module.exports = CommandsFacade;
