"use strict";
const meta = require("../stack_metadata");

module.exports = async () => {
  const stackData = await meta.getFileData();
  const template = stackData.template ? stackData.template : "main.yml";
  return `https://${stackData.bucket}.s3.amazonaws.com/${stackData.domain}/${
    stackData.name
  }/${stackData.version}/${template}`;
};
