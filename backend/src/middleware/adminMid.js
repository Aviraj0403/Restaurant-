import {  UNAUTHORIZED } from '../constants/httpStatus.js'; // Use FORBIDDEN instead of UNAUTHORIZED
import authMid from './authMid.js';

const adminMid = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(UNAUTHORIZED ).send({ error: 'Access denied. Admins only.' });
  }

  next(); // Only call next() if the user is an admin
};

export default [authMid, adminMid];
