import jwt from 'jsonwebtoken';

const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  return process.env.JWT_SECRET;
};

export const signAuthToken = (userId) =>
  jwt.sign({ userId }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

export const verifyAuthToken = (token) => jwt.verify(token, getSecret());

