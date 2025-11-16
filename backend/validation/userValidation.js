const Joi = require("joi");

// 🟢 Signup Validation Middleware
const signUpValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
      "string.empty": "Name is required!",
      "string.min": "Name must be at least 3 characters!",
      "string.max": "Name must not exceed 20 characters!",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required!",
      "string.email": "Please enter a valid email address!",
    }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required!",
        "string.pattern.base": "Phone number must be 10-15 digits!",
      }),
    password: Joi.string().min(6).max(12).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must not exceed 12 characters",
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

const logInValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required!",
      "string.email": "Please enter a valid email address!",
    }),
    password: Joi.string().min(6).max(12).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must not exceed 12 characters",
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

module.exports = { signUpValidation, logInValidation };
