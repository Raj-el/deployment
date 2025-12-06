import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { resolveUserRole } from '../casbin/userRoleResolver.js';

dotenv.config();

export async function verifyAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const roleContext = await resolveUserRole(decoded.email);
    req.user = { ...decoded, ...roleContext };
    console.log('Decoded JWT:', req.user);
    next();
  } catch (err) {
    console.error('Auth verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
}
