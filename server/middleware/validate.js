import { validationResult } from 'express-validator';

/**
 * Collects express-validator errors and returns a 400 with a readable message.
 * Place after a route's validation chain, before the controller.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  res.status(400).json({
    success: false,
    message: errors.array().map((e) => e.msg).join(', '),
    errors: errors.array(),
  });
};

export default validate;
