"use strict";
const meta = require("../stack_metadata");

module.exports = async () => {
  const stackData = await meta.getFileData();
  //http://bucket.s3.amazonaws.com
  return `https://${stackData.bucket}.s3.amazonaws.com/${stackData.domain}/${
    stackData.name
  }/${stackData.version}/main.yml`;
};
