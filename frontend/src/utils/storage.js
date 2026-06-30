const safeWindow = () => (typeof window === 'undefined' ? null : window);

export const readStoredValue = (key, fallback = null) => {
  const win = safeWindow();

  if (!win) {
    return fallback;
  }

  const rawValue = win.localStorage.getItem(key);

  if (rawValue === null) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return rawValue;
  }
};

export const writeStoredValue = (key, value) => {
  const win = safeWindow();

  if (!win) {
    return;
  }

  win.localStorage.setItem(key, JSON.stringify(value));
};

export const removeStoredValue = (key) => {
  const win = safeWindow();

  if (!win) {
    return;
  }

  win.localStorage.removeItem(key);
};

