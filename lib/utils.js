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

exports.getNativeType = (value) => {
  const type = Object.prototype.toString.call(value);
  const t = type.slice(8);
  return t.slice(0, t.length - 1).toLowerCase();
};
