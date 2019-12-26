"use strict";
const metadata = require("../stack_metadata");
const config = require("../util/config");

module.exports = async () => {
  const meta = await metadata.getFileData();
  const template = config.get("aws.template");
  return `https://${meta.Bucket}.s3.amazonaws.com/${meta.Domain}/${meta.Name}/${
    meta.Version
  }/${template}`;
};
