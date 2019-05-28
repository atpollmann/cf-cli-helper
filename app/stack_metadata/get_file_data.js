"use strict";
const file = require("../util/file");
const metaFile = require("./metadata_file");
const { AppError, commonErrors } = require("../errors");

let metaCache = null;

module.exports = exports = async () => {
  let metadata = metaCache;

  if (metadata === null) {
    await file
      .readFromFile(metaFile)
      .then(data => {
        metadata = JSON.parse(data);
        metaCache = metadata;
      })
      .catch(e => {
        throw new AppError(
          commonErrors.cantReadFile,
          "Could not write to stage file: " + e
        );
      });
  }

  return metadata;
};
