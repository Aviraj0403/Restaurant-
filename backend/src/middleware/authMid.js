import jwt from 'jsonwebtoken'; // Import the default export from `jsonwebtoken`
import { UNAUTHORIZED } from '../constants/httpStatus.js';

export default (req, res, next) => {
  const token = req.headers['access_token']; // Ensure you are using the correct header key
  if (!token) return res.status(UNAUTHORIZED).send();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded;
  } catch (error) {
    return res.status(UNAUTHORIZED).send();
  }

  return next();
};
