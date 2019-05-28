"use strict";
const yaml = require("js-yaml");
const CLOUDFORMATION_SCHEMA = require("cloudformation-js-yaml-schema")
  .CLOUDFORMATION_SCHEMA;
const { AppError, commonErrors } = require("../errors");

const main_template_file = require("./main_template_file");
const file = require("../util/file");

module.exports = exports = async () => {
  let data,
    templateContents = {};

  try {
    data = await file.readFromFile(main_template_file);
  } catch (e) {
    throw new AppError(
      commonErrors.localFileNotFound,
      "Could not read main template file: " + e
    );
  }

  try {
    templateContents = yaml.safeLoad(data, { schema: CLOUDFORMATION_SCHEMA });
  } catch (e) {
    throw new AppError(
      commonErrors.badFormat,
      "Main template bad YAML format: " + e
    );
  }

  return templateContents;
};
