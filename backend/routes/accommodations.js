const express = require('express');
const router = express.Router();

// Placeholder for accommodations routes
// Will be implemented in Phase 2

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Accommodations routes - Coming in Phase 2'
  });
});

module.exports = router; 