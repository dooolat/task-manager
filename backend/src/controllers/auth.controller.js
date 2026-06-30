import { asyncHandler } from '../utils/asyncHandler.js';
import { loginUser, registerUser } from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user, token }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, token }
  });
});

