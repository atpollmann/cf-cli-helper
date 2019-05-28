"use strict";
const file = require("../util/file");
const stages = require("./stages");
const stage_file = require("./stage_file");
const { AppError, commonErrors } = require("../errors");

function isValidStageName(stageName) {
  let isValid = false;
  stages.getAll().map(function(k) {
    return (isValid = isValid || stages[k] === stageName);
  });

  return isValid;
}

module.exports = exports = async stage => {
  if (!isValidStageName(stage)) {
    throw new AppError(
      commonErrors.invalidStage,
      "Invalid stage name: " + stage
    );
  }

  try {
    await file.writeToFile(stage_file, stage);
  } catch (e) {
    throw new AppError(
      commonErrors.cantWriteFile,
      "Could not write to stage file: " + e
    );
  }
};
