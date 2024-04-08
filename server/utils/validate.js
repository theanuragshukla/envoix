const validate = (schemas) => {
  return async (req, _, next) => {
    await Promise.all(schemas.map((schema) => schema.run(req)));
    next()
  };
};

module.exports = {
  validate,
};
