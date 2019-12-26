"use strict";

let config = {
  "aws.onCreateStackFailure": "ROLLBACK"
};

function setConfig(full_config) {
  config = full_config;
}

function get(key) {
  if (key in config) {
    return config[key];
  }
  throw new Error(`Configuration key ${key} not found`);
}

exports.get = get;
exports.setConfig = setConfig;
