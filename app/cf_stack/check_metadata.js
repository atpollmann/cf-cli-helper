const { AppError, commonErrors } = require("../errors");

module.exports = exports = metadata => {
  let missingMember = null;
  if (!metadata["Name"]) {
    missingMember = "Name";
  } else if (!metadata["Domain"]) {
    missingMember = "Domain";
  } else if (!metadata["Version"]) {
    missingMember = "Version";
  } else if (!metadata["Bucket"]) {
    missingMember = "Bucket";
  }

  if (missingMember) {
    throw new AppError(
      commonErrors.badMetadata,
      `Parameters file must contain ${missingMember} in the metadata section of the file`
    );
  }
};
