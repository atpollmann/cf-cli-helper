"use strict";
const chalk = require("chalk");
const ui = require("cliui")();
const cf = require("../cf_stack");
const mainTemplate = require("../main_template");
const metadata = require("../stack_metadata");
const s3 = require("../s3");

module.exports = async () => {
  const main = await mainTemplate.getTemplate();
  const meta = await metadata.getFileData();
  const stack = await cf.getStackInfo(meta.name);
  const url = await s3.templateURL();
  const isUploaded = await s3.templateExists(
    meta.bucket,
    meta.domain,
    meta.name,
    meta.version
  );

  const w1 = 18;
  const w2 = 120;
  const padding = [0, 0, 0, 1];
  const data = [
    { label: "Name", value: meta.name },
    { label: "Domain", value: meta.domain },
    { label: "Description", value: main.Description },
    { label: "Bucket", value: meta.bucket },
    { label: "Template URL", value: url },
    {
      label: "Uploaded to S3?",
      value: isUploaded ? chalk`{green yes}` : chalk`{red no}`
    },
    { label: "Local version", value: meta.version },
    { label: "Status", value: cf.formatStackStatus(stack.StackStatus) },
    { label: "Id", value: stack.StackId }
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
