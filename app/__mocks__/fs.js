"use strict";
const path = require("path");
const fs = jest.genMockFromModule("fs");

let mockFiles = Object.create(null);
let mockFilesContents = Object.create(null);
let canWrite = true;

function __setCanWrite(can) {
  canWrite = can;
}

function __getCanWrite() {
  return canWrite;
}

function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  mockFiles = newMockFiles;
}

function __addMockFile(mockFile) {
  if (Object.keys(mockFiles).length === 0) {
    let mockFiles = {};
    mockFiles[mockFile] = [];
    __setMockFiles(mockFiles);
  } else {
    mockFiles[mockFile] = [];
  }
}

function __setMockFilesContents(newMockFilesContents) {
  mockFilesContents = Object.create(null);
  mockFilesContents = newMockFilesContents;
}

function readdirSync(directoryPath) {
  if (mockFiles[directoryPath] && __getCanWrite()) {
    return mockFiles[directoryPath];
  } else {
    throw new Error(`MOCK ENOENT: no such file or directory ${directoryPath}`);
  }
}

function readFile(filepath, cb) {
  const contents = mockFilesContents["'" + filepath + "'"];
  if (contents && __getCanWrite()) {
    cb(undefined, contents);
  } else {
    cb(`MOCK ENOENT: no such file or directory ${filepath}`);
  }
}

function readFileSync(localFilePath) {
  const localPath = path.dirname(localFilePath);
  const localFile = path.basename(localFilePath);
  if (
    mockFiles[localPath] &&
    mockFiles[localPath].filter(content => content === localFile).length > 0 &&
    __getCanWrite()
  ) {
    return `The contents of the file ${localFilePath}`;
  } else {
    throw new Error(`MOCK ENOENT: no such file or directory ${localFilePath}`);
  }
}

function statSync(filepath) {
  const expr = /\/.+\..+/;
  const isFile = expr.test(filepath);
  return {
    isDirectory: () => !isFile
  };
}

function writeFile(file, data, cb) {
  if (__getCanWrite()) {
    mockFilesContents["'" + file + "'"] = data;
    cb(undefined);
  } else {
    cb(`MOCK NOENT: Cant write to file ${file}`);
  }
}

function mkdir(dir, mode, cb) {
  if (__getCanWrite()) {
    __addMockFile(dir);
    cb(undefined);
  } else {
    const e = new Error(`ENOENT: Cant write to directory ${dir}`);
    e.code = "ENOENT";
    cb(e);
  }
}

fs.__setMockFiles = __setMockFiles;
fs.__addMockFile = __addMockFile;
fs.__setMockFilesContents = __setMockFilesContents;
fs.__setCanWrite = __setCanWrite;
fs.__getCanWrite = __getCanWrite;
fs.readFile = readFile;
fs.readdirSync = readdirSync;
fs.readFileSync = readFileSync;
fs.statSync = statSync;
fs.writeFile = writeFile;
fs.mkdir = mkdir;

module.exports = fs;
