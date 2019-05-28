"use strict";
const AWS = require("../util/aws");
const { AppError, commonErrors } = require("../errors");

module.exports = exports = stackName => {
  const cf = new AWS.CloudFormation();

  return new Promise((resolve, reject) => {
    cf.describeStacks({ StackName: stackName }, (err, data) => {
      if (err)
        reject(
          new AppError(
            commonErrors.stackNotFound,
            "Error getting stack info: " + err
          )
        );
      else resolve(data.Stacks[0]);
    });
  });
};
