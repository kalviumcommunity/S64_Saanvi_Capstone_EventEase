const { body, validationResult } = require('express-validator');

exports.validateGuest = [
  // Name validation
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  // Contact validation
  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Invalid contact number format'),

  // Status validation
  body('status')
    .optional()
    .isIn(['Confirmed', 'Pending', 'Declined'])
    .withMessage('Invalid status value'),

  // Time validation
  body('time')
    .optional()
    .isIn(['On time', 'A little late', 'Not responded'])
    .withMessage('Invalid time value'),

  // PlusOne validation
  body('plusOne')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Plus one count must be a non-negative integer'),

  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation Error',
        details: errors.array() 
      });
    }
    next();
  }
]; 