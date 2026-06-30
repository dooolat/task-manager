export const getErrorMessage = (error) => {
  if (!error) {
    return 'Something went wrong';
  }

  const apiMessage = error.response?.data?.message;
  const apiErrors = error.response?.data?.errors;

  if (Array.isArray(apiErrors) && apiErrors.length > 0) {
    return apiErrors.join(' • ');
  }

  if (apiMessage) {
    return apiMessage;
  }

  return error.message || 'Something went wrong';
};

