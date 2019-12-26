"use strict";
const config = require("../util/config");

module.exports = exports = () => {
  const allowed_envs = ["dev", "prod"];
  let env = allowed_envs[0];
  try {
    const configEnv = config.get("env");
    for (let e of allowed_envs) {
      if (configEnv === e) {
        env = configEnv;
        break;
      }
    }
  } catch (e) {}

  return env;
};
