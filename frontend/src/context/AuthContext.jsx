import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getProfileRequest, loginRequest, registerRequest } from '../services/authService.js';
import { readStoredValue, removeStoredValue, writeStoredValue } from '../utils/storage.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => readStoredValue('task-manager-token', ''));
  const [user, setUser] = useState(() => readStoredValue('task-manager-user', null));
  const [bootstrapping, setBootstrapping] = useState(true);

  const persistAuth = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    writeStoredValue('task-manager-token', nextToken);
    writeStoredValue('task-manager-user', nextUser);
  }, []);

  const logout = useCallback(() => {
    setToken('');
    setUser(null);
    removeStoredValue('task-manager-token');
    removeStoredValue('task-manager-user');
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!readStoredValue('task-manager-token', '')) {
      setBootstrapping(false);
      return null;
    }

    try {
      const profile = await getProfileRequest();
      setUser(profile);
      writeStoredValue('task-manager-user', profile);
      setBootstrapping(false);
      return profile;
    } catch (error) {
      logout();
      setBootstrapping(false);
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    refreshProfile().catch(() => {});
  }, [refreshProfile]);

  const register = useCallback(async (payload) => {
    const response = await registerRequest(payload);
    persistAuth(response.token, response.user);
    return response;
  }, [persistAuth]);

  const login = useCallback(async (payload) => {
    const response = await loginRequest(payload);
    persistAuth(response.token, response.user);
    return response;
  }, [persistAuth]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loading: bootstrapping,
      register,
      login,
      logout,
      refreshProfile
    }),
    [bootstrapping, login, logout, refreshProfile, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

