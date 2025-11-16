const Joi = require("joi");

const adminValidation = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      "string.empty": "Username is required!",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must not exceed 30 characters",
    }),
    password: Joi.string().min(6).max(20).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must not exceed 20 characters",
    }),
    secretCode: Joi.string().required().messages({
      "string.empty": "Secret code is required",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(401).json({
      success: false,
      field: error.details[0].path[0],
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = { adminValidation };
