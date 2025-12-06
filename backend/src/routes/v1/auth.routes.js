import express from 'express';
import {
  sendInvite,
  acceptInvite,
  loginUser,
  getProfile,
} from '../../controllers/auth.controllers.js';
import { verifyAuth } from '../../middleware/auth.middleware.js';

const loginRoutes = express.Router();

loginRoutes.post('/invite', verifyAuth, sendInvite);
loginRoutes.post('/invite/accept', acceptInvite);
loginRoutes.post('/login', loginUser);
loginRoutes.get('/profile', verifyAuth, getProfile);

export default loginRoutes;
