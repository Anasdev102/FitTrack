export const getApiErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  const errors = error?.response?.data?.errors;
  if (errors) {
    const firstError = Object.values(errors)[0];
    if (Array.isArray(firstError)) return firstError[0];
    return firstError;
  }

  if (error?.request) {
    return "Unable to connect to the server. Please check your connection.";
  }

  return "Something went wrong. Please try again later.";
};

