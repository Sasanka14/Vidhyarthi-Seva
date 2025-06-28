const express = require('express');
const router = express.Router();

// Placeholder for test series routes
// Will be implemented in Phase 2

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test Series routes - Coming in Phase 2'
  });
});

module.exports = router; 