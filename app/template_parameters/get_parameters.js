const file = require("../util/file");
const parameters_file = require("./parameters_file");
const { AppError, commonErrors } = require("../errors");

let paramsCache = null;

async function getFileContents() {
  try {
    return await file.readFromFile(parameters_file);
  } catch (e) {
    throw e;
  }
}

async function parseParams(fileContents) {
  try {
    return JSON.parse(fileContents);
  } catch (e) {
    throw e;
  }
}

module.exports = exports = async () => {
  let fileContents,
    params = paramsCache;

  if (params === null) {
    try {
      fileContents = await getFileContents();
    } catch (e) {
      throw new AppError(commonErrors.localFileNotFound, e);
    }

    try {
      params = await parseParams(fileContents);
      paramsCache = params;
    } catch (e) {
      throw new AppError(commonErrors.badFormat, e);
    }
  }

  return params;
};
