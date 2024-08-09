import { UNAUTHORIZED } from '../constants/httpStatus.js';
import authMid from './authMid.js';
const adminMid = (req, res, next) => {
  if (!req.user.isAdmin) res.status(UNAUTHORIZED).send();

  return next();
};

export default [authMid, adminMid];
