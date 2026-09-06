const multer = require('multer');

/**
 * Wraps a multer middleware so its errors (file too large, wrong type,
 * too many files) come back as a clean JSON response instead of crashing
 * or falling through to the generic Express error handler.
 */
function handleUploadErrors(multerMiddleware) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (!err) return next();

      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ success: false, message: 'One of the files exceeds the maximum allowed size.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(413).json({ success: false, message: 'Too many files attached (max 10).' });
        }
        return res.status(400).json({ success: false, message: err.message });
      }

      // Thrown from our custom fileFilter (disallowed extension)
      return res.status(400).json({ success: false, message: err.message });
    });
  };
}

module.exports = handleUploadErrors;
