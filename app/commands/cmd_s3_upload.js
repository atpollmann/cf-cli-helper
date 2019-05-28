"use strict";
const chalk = require("chalk");
const { events } = require("../util/events");
const metadata = require("../stack_metadata");
const workdir = require("../util/working_dir");
const s3 = require("../s3");

module.exports = command => {
  command.emit(events.commandPrompting);
  const uploader = new s3.Uploader();

  uploader.on(events.s3DirectoryUploading, data => {
    console.log(
      chalk`\nUploading directory {blue.underline ${
        data.localDirPath
      }} to S3:\n`
    );
  });

  uploader.on(events.s3ObjectUploaded, data => {
    console.log(
      chalk`   ${data.s3Response.ETag} {yellow - ${data.s3Path}} {green OK}`
    );
  });

  uploader.on(events.s3DirectoryUploaded, () => {
    console.log(chalk`{green \nDirectory uploaded succesfully}`);
  });

  return new Promise(async (resolve, reject) => {
    const meta = await metadata.getFileData();
    try {
      await uploader.putDirectory(
        workdir() + "/templates",
        `${meta.domain}/${meta.name}/${meta.version}`,
        `${meta.bucket}`
      );
      resolve();
    } catch (e) {
      reject(console.log(chalk`{red.bold ERROR ${e}}`));
    }
  });
};
