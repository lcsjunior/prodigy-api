const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const { validationResult } = require('express-validator');
const chains = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const validationChain = require(path.join(__dirname, file));
    Object.assign(chains, validationChain);
  });

const validate = (action) => {
  const validations = chains[action]();
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const result = validationResult(req);
    const hasErrors = !result.isEmpty();
    if (hasErrors) {
      res.status(400).json({ errors: result.array() });
    } else {
      next();
    }
  };
};

module.exports = {
  validate,
};
