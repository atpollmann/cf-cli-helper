function AppError(name, description) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.name = name;
  this.description = description;
}

AppError.prototype = Error.prototype;

module.exports = exports = AppError;
