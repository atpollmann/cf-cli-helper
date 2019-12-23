const { AppError, commonErrors } = require("../errors");

module.exports = exports = metadata => {
  let missingMember = null;
  if (!metadata["name"]) {
    missingMember = "name";
  } else if (!metadata["domain"]) {
    missingMember = "domain";
  } else if (!metadata["version"]) {
    missingMember = "version";
  } else if (!metadata["bucket"]) {
    missingMember = "bucket";
  }

  if (missingMember) {
    throw new AppError(
      commonErrors.badMetadata,
      `Parameters file must contain ${missingMember} in the metadata section of the file`
    );
  }
};
