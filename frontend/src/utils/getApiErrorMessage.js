const friendlyValidationMessage = (message, field = "field") => {
  if (!message || typeof message !== "string") return null;

  const label = field
    .replace(/_id$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const messages = {
    "validation.required": `${label} is required.`,
    "validation.email": `${label} must be a valid email address.`,
    "validation.exists": `The selected ${label.toLowerCase()} is invalid.`,
    "validation.date": `${label} must be a valid date.`,
    "validation.date_format": `${label} must use the correct format.`,
    "validation.after": `${label} must be after the start time.`,
    "validation.in": `The selected ${label.toLowerCase()} is invalid.`,
    "validation.numeric": `${label} must be a number.`,
  };

  return messages[message] || message;
};

export const getApiErrorMessage = (error) => {
  const errors = error?.response?.data?.errors;
  if (errors) {
    const [field, firstError] = Object.entries(errors)[0] || [];
    const message = Array.isArray(firstError) ? firstError[0] : firstError;
    return friendlyValidationMessage(message, field);
  }

  if (error?.response?.data?.message) {
    return friendlyValidationMessage(error.response.data.message);
  }


  if (error?.request) {
    return "Unable to connect to the server. Please check your connection.";
  }

  return "Something went wrong. Please try again later.";
};

