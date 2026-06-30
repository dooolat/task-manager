import { asyncHandler } from '../utils/asyncHandler.js';
import { getUserProfile } from '../services/auth.service.js';

export const profile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.userId);

  res.status(200).json({
    success: true,
    data: user
  });
});

