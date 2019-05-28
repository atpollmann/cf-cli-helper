"use strict";
const chalk = require("chalk");
const ui = require("cliui")();
const meta = require("../stack_metadata");
const cf = require("../cf_stack");

module.exports = async () => {
  const stackData = await meta.getFileData();
  const events = await cf.getStackEvents(stackData.name);

  const w1 = 30;
  const w2 = 40;
  const w3 = 30;
  const w4 = 50;
  const padding = [0, 1, 0, 1];

  ui.resetOutput();
  ui.div(
    { width: w1, padding, text: chalk`{blue.bold Time}` },
    { width: w2, padding, text: chalk`{blue.bold Type}` },
    { width: w3, padding, text: chalk`{blue.bold Status}` },
    { width: w4, padding, text: chalk`{blue.bold Status Reason}` }
  );
  events.map(e => {
    ui.div(
      { width: w1, padding, text: e.timestamp.toISOString() },
      { width: w2, padding, text: e.resourceType },
      { width: w3, padding, text: cf.formatStackStatus(e.resourceStatus) },
      {
        width: w4,
        padding,
        text: e.resourceStatusReason === undefined ? "" : e.resourceStatusReason
      }
    );
  });

  console.log(ui.toString() + "\n\n");
};
