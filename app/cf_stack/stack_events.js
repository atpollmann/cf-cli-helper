"use strict";
const AWS = require("../util/aws");
const { AppError, commonErrors } = require("../errors");

function processRawEvents(awsResponse) {
  return awsResponse.StackEvents.map(e => {
    return {
      timestamp: e.Timestamp,
      resourceType: e.ResourceType,
      resourceStatus: e.ResourceStatus,
      resourceStatusReason: e.ResourceStatusReason,
      logicalResourceId: e.LogicalResourceId
    };
  });
}

module.exports = exports = stackName => {
  const cf = new AWS.CloudFormation();

  return new Promise((resolve, reject) => {
    cf.describeStackEvents({ StackName: stackName }, (err, data) => {
      if (err)
        reject(
          new AppError(
            commonErrors.stackNotFound,
            "Error getting stack events: " + err
          )
        );
      else resolve(processRawEvents(data));
    });
  });
};
