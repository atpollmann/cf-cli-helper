"use strict";
const chalk = require("chalk");
const ui = require("cliui")();
const cf = require("../cf_stack");
const _stackStatus = require("../cf_stack/stack_status");
const mainTemplate = require("../main_template");
const metadata = require("../stack_metadata");
const s3 = require("../s3");
const environment = require("../environment");

module.exports = async () => {
  const main = await mainTemplate.getTemplate();
  const meta = await metadata.getFileData();
  const url = await s3.templateURL();
  const isUploaded = await s3.templateExists(
    meta.Bucket,
    meta.Domain,
    meta.Name,
    meta.Version
  );
  let stack = undefined;
  let stackId = undefined;
  let stackStatus = undefined;

  try {
    stack = await cf.getStackInfo(environment.getStackName(meta.Name));
    stackId = stack.StackId;
    stackStatus = cf.formatStackStatus(stack.StackStatus);
  } catch (e) {
    stackStatus = cf.formatStackStatus(_stackStatus.NOT_FOUND);
  }

  const w1 = 18;
  const w2 = 120;
  const padding = [0, 0, 0, 1];
  const data = [
    { label: "Name", value: meta.Name },
    { label: "Environment", value: environment.get() },
    { label: "Local version", value: meta.Version },
    { label: "Domain", value: meta.Domain },
    { label: "Description", value: main.Description },
    { label: "Bucket", value: meta.Bucket },
    { label: "Template URL", value: url },
    {
      label: "Uploaded to S3?",
      value: isUploaded ? chalk`{green yes}` : chalk`{red no}`
    },
    { label: "Status", value: stackStatus },
    { label: "Id", value: stackId }
  ];

  console.log(chalk`{blue.bold STACK INFORMATION}`);
  ui.resetOutput();
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

  console.log(ui.toString() + "\n\n");
};
