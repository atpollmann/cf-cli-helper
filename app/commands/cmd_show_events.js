"use strict";
const chalk = require("chalk");
const ui = require("cliui")();
const meta = require("../stack_metadata");
const cf = require("../cf_stack");

function getFormattedDate(date) {
  return (
    date.getFullYear() +
    pad(date.getMonth()) +
    pad(date.getDay()) +
    pad(date.getHours()) +
    pad(date.getMinutes())
  );
}

function pad(digit) {
  return digit < 10 ? "0" + digit : digit;
}

module.exports = async () => {
  const stackData = await meta.getFileData();
  try {
    const events = await cf.getStackEvents(stackData.name);

    const w1 = 15;
    const w2 = 40;
    const w3 = 40;
    const w4 = 20;
    const w5 = 50;
    const padding = [0, 1, 0, 1];

    ui.resetOutput();
    ui.div(
      { width: w1, padding, text: chalk`{blue.bold Time}` },
      { width: w2, padding, text: chalk`{blue.bold Type}` },
      { width: w4, padding, text: chalk`{blue.bold Logical ID}` },
      { width: w3, padding, text: chalk`{blue.bold Status}` },
      { width: w5, padding, text: chalk`{blue.bold Status Reason}` }
    );
    events.map(e => {
      ui.div(
        { width: w1, padding, text: getFormattedDate(e.timestamp) },
        { width: w2, padding, text: e.resourceType },
        { width: w3, padding, text: e.logicalResourceId },
        { width: w4, padding, text: cf.formatStackStatus(e.resourceStatus) },
        {
          width: w5,
          padding,
          text:
            e.resourceStatusReason === undefined ? "" : e.resourceStatusReason
        }
      );
    });
    console.log(ui.toString() + "\n\n");
  } catch (e) {
    console.log(chalk`{red ${e.name}: ${e.description}}\n\n`);
  }
};
