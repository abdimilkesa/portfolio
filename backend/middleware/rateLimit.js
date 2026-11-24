import rateLimit from 'express-rate-limit';

function reject(message) {
  return (_req, res) => {
    res.status(429).json({ success: false, message });
  };
}

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: reject('Too many sign-in attempts. Please wait a few minutes and try again.'),
});

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: reject('Too many messages were sent from this network. Please try again later.'),
});
