"use strict";
const mkdirp = require("mkdirp");
const fs = require("fs");
const path = require("path");

exports.writeToFile = async function writeToFile(file, data) {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(file), e => {
      if (e) reject(e);
      fs.writeFile(file, data, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

exports.readFromFile = async function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err);
      else resolve(data.toString());
    });
  });
};
