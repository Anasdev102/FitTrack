export const authMessages = {
  incorrect: "Incorrect email or password. Please try again.",
  accountNotFound: "No account was found with this email address.",
  inactive: "Your account is not active. Please contact the gym administration.",
  network: "Unable to connect to the server. Please check your internet connection.",
  server: "Something went wrong. Please try again later.",
  emailRequired: "Email is required.",
  passwordRequired: "Password is required.",
  passwordMin: "Password must be at least 8 characters.",
  nameRequired: "Name is required.",
  confirmPasswordRequired: "Confirm password is required.",
  passwordsDoNotMatch: "Password confirmation does not match.",
  invalidEmail: "Please enter a valid email address.",
  emailExists: "This email is already registered.",
  registration: "Registration failed. Please check the form and try again.",
};

export function authText(key) {
  return authMessages[key] || authMessages.server;
}

export function getApiErrorMessage(error, context = "login") {
  if (!error?.response) {
    return error?.request ? authText("network") : authText("server");
  }

  const status = error.response.status;
  const data = error.response.data || {};
  const validationMessage = getFirstValidationMessage(data.errors);
  const apiMessage = validationMessage || data.message;
  const friendlyMessage = normalizeAuthMessage(apiMessage);

  if (status === 401) return friendlyMessage || authText("incorrect");
  if (status === 403) return friendlyMessage || authText("inactive");
  if (status >= 500) return authText("server");

  if (status === 422) {
    return friendlyMessage || (context === "login" ? authText("incorrect") : authText("registration"));
  }

  return friendlyMessage || authText("server");
}

export function friendlyAuthError(error, context = "login") {
  return getApiErrorMessage(error, context);
}

function getFirstValidationMessage(errors) {
  if (!errors || typeof errors !== "object") return null;

  const firstError = Object.values(errors)[0];
  if (Array.isArray(firstError)) return firstError[0] || null;
  return firstError || null;
}

function normalizeAuthMessage(message) {
  if (!message) return null;

  const text = String(message);
  const lower = text.toLowerCase();

  if (lower.includes("incorrect") || lower.includes("invalid login") || lower.includes("invalid credential")) {
    return authText("incorrect");
  }

  if (lower.includes("not found")) return authText("accountNotFound");
  if (lower.includes("inactive")) return authText("inactive");
  if (lower.includes("email is required")) return authText("emailRequired");
  if (lower.includes("password is required")) return authText("passwordRequired");
  if (lower.includes("name is required")) return authText("nameRequired");
  if (lower.includes("confirm password is required")) return authText("confirmPasswordRequired");
  if (lower.includes("valid email")) return authText("invalidEmail");
  if (lower.includes("already registered") || lower.includes("already exists") || lower.includes("already been taken") || lower.includes("unique")) {
    return authText("emailExists");
  }
  if (lower.includes("at least 8") || lower.includes("minimum is 8") || lower.includes("min:8")) return authText("passwordMin");
  if (lower.includes("confirmation") || lower.includes("does not match") || lower.includes("must match")) {
    return authText("passwordsDoNotMatch");
  }

  return text;
}
