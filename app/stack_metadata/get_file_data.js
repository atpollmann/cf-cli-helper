"use strict";
const file = require("../util/file");
const metaFile = require("./metadata_file");
const { AppError, commonErrors } = require("../errors");

module.exports = exports = async () => {
  let metadata = null;

  await file
    .readFromFile(metaFile)
    .then(data => {
      metadata = JSON.parse(data).metadata;
    })
    .catch(e => {
      throw new AppError(commonErrors.cantReadFile, "Could not get file: " + e);
    });

  return metadata;
};
