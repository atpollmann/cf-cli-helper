"use strict";
const stages = {
  IDLE: "idle",
  DELETING_STACK: "deleting_stack",
  DEPLOYING_STACK: "deploying_stack"
};

module.exports.IDLE = stages.IDLE;
module.exports.DELETING_STACK = stages.DELETING_STACK;
module.exports.DEPLOYING_STACK = stages.DEPLOYING_STACK;
module.exports.getAll = () => {
  return Object.keys(stages);
};
