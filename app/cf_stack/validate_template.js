"use strict";
const AWS = require("../util/aws");
const { AppError, commonErrors } = require("../errors");

module.exports = exports = url => {
  const cf = new AWS.CloudFormation();

  return new Promise((resolve, reject) => {
    cf.validateTemplate({ TemplateURL: url }, (err, data) => {
      if (err)
        reject(
          new AppError(
            commonErrors.invalidTemplate,
            "Error validating template in AWS: " + err
          )
        );
      else resolve(data);
    });
  });
};
