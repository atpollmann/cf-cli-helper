"use strict";
const AWS = require("../util/aws");

const s3 = new AWS.S3();

module.exports = async (bucket, domain, name, version) => {
  return new Promise(resolve => {
    s3.headObject(
      {
        Bucket: bucket,
        Key: `${domain}/${name}/${version}/main.yml`
      },
      err => {
        if (err) resolve(false);
        else {
          resolve(true);
        }
      }
    );
  });
};
