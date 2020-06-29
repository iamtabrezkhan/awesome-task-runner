exports.isObject = (value) => {
  return exports.getNativeType(value) === "object";
};

exports.isBoolean = (value) => {
  return exports.getNativeType(value) === "boolean";
};

exports.isFalsy = (value) => {
  return !!value === false;
};

exports.isTruthy = (value) => {
  return !!value === true;
};

exports.getNativeType = require("native-type");
