import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * Protect routes — requires a valid Bearer token.
 * Attaches the authenticated user (without password) to req.user.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized — user no longer exists');
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized — token invalid or expired');
  }
});

/** Restrict a route to admins only. Use after `protect`. */
export const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403);
  throw new Error('Admin access required');
};
