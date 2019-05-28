const { AppError, commonErrors } = require("../errors");
module.exports = exports = (template, parameters) => {
  if (template["Parameters"]) {
    const tmplParamsKeys = Object.keys(template.Parameters);
    const paramsKeys = Object.keys(parameters);

    if (tmplParamsKeys.length !== paramsKeys.length) {
      throw new AppError(
        commonErrors.badParameters,
        `Template file requires ${
          tmplParamsKeys.length
        } parameters. Parameters file contains ${paramsKeys}`
      );
    }

    tmplParamsKeys.map(tmplKey => {
      if (!(tmplKey in parameters)) {
        throw new AppError(
          commonErrors.badParameters,
          `Required template parameter ${tmplKey} not found in parameters file`
        );
      }
    });
  }
};
