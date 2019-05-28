"use strict";
const EventEmitter = require("events");
const { events } = require("../util/events");
const AWS = require("../util/aws");
const path = require("path");
const fs = require("fs");
const { AppError, commonErrors } = require("../errors");

const s3 = new AWS.S3();

let fileList = [];

async function scanDirectory(localDirPath, s3Path, bucket, basepath, uploader) {
  try {
    fs.readdirSync(localDirPath).forEach(async fileName => {
      const filePath = path.join(localDirPath, fileName);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        await scanDirectory(filePath, s3Path, bucket, basepath, uploader);
      } else {
        const s3Key = s3Path + filePath.substring(basepath.length);
        fileList.push({ filePath, s3Key, bucket });
      }
    });
  } catch (e) {
    throw new AppError(commonErrors.localFileNotFound, e);
  }
}

class S3Uploader extends EventEmitter {
  async putDirectory(localDirPath, s3Path, bucket) {
    try {
      this.emit(events.s3DirectoryUploading, { localDirPath, s3Path, bucket });
      await scanDirectory(localDirPath, s3Path, bucket, localDirPath, this);
      for (let i = 0; i < fileList.length; i++) {
        let f = fileList[i];
        await this.putFile(f.filePath, f.s3Key, f.bucket);
      }
    } catch (e) {
      throw e;
    }
    fileList = [];
    this.emit(events.s3DirectoryUploaded, { localDirPath, s3Path, bucket });
  }

  async putFile(localFilePath, s3Path, bucket) {
    let body = undefined;

    try {
      body = fs.readFileSync(localFilePath);
    } catch (e) {
      throw new AppError(commonErrors.localFileNotFound, e);
    }
    const params = {
      Bucket: bucket,
      Key: s3Path,
      Body: body
    };

    this.emit(events.s3ObjectUploading, { localFilePath, s3Path, bucket });

    try {
      return await new Promise((resolve, reject) => {
        s3.putObject(params, (err, data) => {
          if (err) reject(err);
          else {
            this.emit(events.s3ObjectUploaded, { s3Path, s3Response: data });
            resolve(data);
          }
        });
      });
    } catch (e) {
      throw new AppError(commonErrors.s3Error, e);
    }
  }
}

module.exports = exports = S3Uploader;
