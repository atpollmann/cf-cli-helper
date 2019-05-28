"use strict";
const stages = require("./stages");
const file = require("../util/file");
const stage_file = require("./stage_file");
const { AppError, commonErrors } = require("../errors");

function sanitize(stage_val) {
  // TODO: What if the content of the file is changed maliciously?
  return stage_val;
}

module.exports = exports = async () => {
  let cur_stage = "";

  try {
    cur_stage = await file.readFromFile(stage_file);
  } catch (e) {
    cur_stage = stages.IDLE;
    try {
      await file.writeToFile(stage_file, cur_stage);
    } catch (e) {
      throw new AppError(
        commonErrors.cantWriteFile,
        "Could not read/write to stage file " + stage_file + ". " + e
      );
    }
  }

  return sanitize(cur_stage);
};
