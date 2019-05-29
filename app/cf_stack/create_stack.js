"use strict";
const AWS = require("../util/aws");
const config = require("../util/config");
const getStackInfo = require("./stack_info");
const { AppError, commonErrors } = require("../errors");
const stackStatus = require("./stack_status");

function buildStackParameters(parameters) {
  return Object.keys(parameters).map(key => {
    return {
      ParameterKey: key,
      ParameterValue: parameters[key]
    };
  });
}

function canCreateStack(currentStackStatus) {
  const statuses = [
    stackStatus.CREATE_IN_PROGRESS,
    stackStatus.CREATE_COMPLETE,
    stackStatus.DELETE_IN_PROGRESS,
    stackStatus.UPDATE_IN_PROGRESS,
    stackStatus.ROLLBACK_IN_PROGRESS
  ];

  for (let s in statuses) {
    if (statuses[s] === currentStackStatus) {
      return false;
    }
  }

  return true;
}

module.exports = exports = async (stackName, s3Url, parameters) => {
  const cf = new AWS.CloudFormation();
  let stack = undefined;

  try {
    stack = await getStackInfo(stackName);
  } catch (e) {}

  if (stack && !canCreateStack(stack.StackStatus)) {
    throw new AppError(
      commonErrors.stackCreateError,
      `The stack ${stackName} has the status ${
        stack.StackStatus
      } and cant be created`
    );
  }

  return new Promise((resolve, reject) => {
    const params = {
      StackName: stackName,
      OnFailure: config.get("aws.onCreateStackFailure"),
      Parameters: buildStackParameters(parameters),
      ResourceTypes: ["AWS::*"],
      TemplateURL: s3Url
    };
    cf.createStack(params, (err, data) => {
      if (err)
        reject(
          new AppError(
            commonErrors.stackCreateError,
            "Error creating stack in AWS: " + err
          )
        );
      else resolve(data);
    });
  });
};
