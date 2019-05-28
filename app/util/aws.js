"use strict";
const config = require("config");
const _aws = require("aws-sdk");

const profile = config.get("aws.credentialsProfile");
const region = config.get("aws.region");

_aws.config.credentials = new _aws.SharedIniFileCredentials({ profile });
_aws.config.region = region;

module.exports = _aws;
