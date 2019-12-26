const file = require("../util/file");
const parameters_file = require("./parameters_file");
const { AppError, commonErrors } = require("../errors");
const environment = require("../environment");

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
    return JSON.parse(fileContents).parameters;
  } catch (e) {
    throw e;
  }
}

module.exports = exports = async () => {
  let fileContents,
    environmentObj,
    params = paramsCache;

  if (params === null) {
    try {
      fileContents = await getFileContents();
    } catch (e) {
      throw new AppError(commonErrors.localFileNotFound, e);
    }

    try {
      environmentObj = { Environment: environment.get() };
      let preParams = await parseParams(fileContents);
      params = paramsCache = { ...environmentObj, ...preParams };
    } catch (e) {
      throw new AppError(commonErrors.badFormat, e);
    }
  }

  return params;
};
