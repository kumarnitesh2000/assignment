const allowedKeys = ['weight', 'absent', 'preferred_language', 'performance_score', 'shift_timing', 'preferred_city'];

const validateKeysForModeratorUpdate = (req, res, next) => {
    const keys = Object.keys(req.body);

    for (const key of keys) {
        if (!allowedKeys.includes(key)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: `Invalid key: ${key}`
            });
        }
    }

    next();
};

module.exports = {validateKeysForModeratorUpdate};