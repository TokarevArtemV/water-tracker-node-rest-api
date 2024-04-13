const handleSaveError = (error, _, next) => {
  const { name, code } = error;
  error.status = name === "MongoServerError" && code === 1100 ? 409 : 400;
  next();
};

const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
export default { handleSaveError, setUpdateSettings };
