"use strict";
const config = {
  "aws.onCreateStackFailure": "ROLLBACK"
};

function get(key) {
  if (key in config) {
    return config[key];
  }
  throw new Error(`Configuration key ${key} not found`);
}

exports.get = get;
