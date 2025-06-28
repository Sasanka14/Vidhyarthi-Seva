const express = require('express');
const router = express.Router();

// Placeholder for meals routes
// Will be implemented in Phase 2

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Meals routes - Coming in Phase 2'
  });
});

module.exports = router; 