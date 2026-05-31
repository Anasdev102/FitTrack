const messages = {
  en: {
    incorrect: "Incorrect email or password. Please try again.",
    accountNotFound: "No account was found with this email address.",
    inactive: "Your account is not active. Please contact the gym administration.",
    network: "Unable to connect to the server. Please check your internet connection.",
    server: "Something went wrong. Please try again later.",
    emailRequired: "Email is required.",
    passwordRequired: "Password is required.",
    passwordMin: "Password must contain at least 8 characters.",
    nameRequired: "Name is required.",
    invalidEmail: "Please enter a valid email address.",
    emailExists: "An account already exists with this email address.",
    registration: "Registration failed. Please check the form and try again.",
  },
  fr: {
    incorrect: "Adresse e-mail ou mot de passe incorrect. Veuillez réessayer.",
    accountNotFound: "Aucun compte n'a été trouvé avec cette adresse e-mail.",
    inactive: "Votre compte n'est pas actif. Veuillez contacter l'administration de la salle.",
    network: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.",
    server: "Une erreur est survenue. Veuillez réessayer plus tard.",
    emailRequired: "L'adresse e-mail est requise.",
    passwordRequired: "Le mot de passe est requis.",
    passwordMin: "Le mot de passe doit contenir au moins 8 caractères.",
    nameRequired: "Le nom est requis.",
    invalidEmail: "Veuillez saisir une adresse e-mail valide.",
    emailExists: "Un compte existe déjà avec cette adresse e-mail.",
    registration: "L'inscription a échoué. Veuillez vérifier le formulaire et réessayer.",
  },
  ar: {
    incorrect: "البريد الإلكتروني أو كلمة المرور غير صحيحة. المرجو المحاولة مرة أخرى.",
    accountNotFound: "لم يتم العثور على حساب بهذا البريد الإلكتروني.",
    inactive: "حسابك غير نشط. المرجو التواصل مع إدارة النادي.",
    network: "تعذر الاتصال بالخادم. المرجو التحقق من اتصالك بالإنترنت.",
    server: "حدث خطأ ما. المرجو المحاولة لاحقا.",
    emailRequired: "البريد الإلكتروني مطلوب.",
    passwordRequired: "كلمة المرور مطلوبة.",
    passwordMin: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل.",
    nameRequired: "الاسم مطلوب.",
    invalidEmail: "المرجو إدخال بريد إلكتروني صحيح.",
    emailExists: "يوجد حساب بهذا البريد الإلكتروني مسبقا.",
    registration: "فشل إنشاء الحساب. المرجو التحقق من البيانات والمحاولة مرة أخرى.",
  },
};

function locale() {
  const language = navigator.language?.toLowerCase() || "en";
  if (language.startsWith("fr")) return "fr";
  if (language.startsWith("ar")) return "ar";
  return "en";
}

export function authText(key) {
  const current = messages[locale()] || messages.en;
  return current[key] || messages.en[key] || messages.en.server;
}

export function friendlyAuthError(error, context = "login") {
  if (!error.response) return authText("network");

  const status = error.response.status;
  const data = error.response.data || {};
  const rawText = `${data.message || ""} ${JSON.stringify(data.errors || {})}`.toLowerCase();

  if (status === 401) return authText("incorrect");
  if (status === 403 || rawText.includes("inactive")) return authText("inactive");
  if (status >= 500) return authText("server");

  if (status === 422) {
    if (context === "login") {
      if (rawText.includes("not found")) return authText("accountNotFound");
      return authText("incorrect");
    }

    const errors = data.errors || {};
    if (errors.email) {
      const emailError = String(errors.email[0] || "").toLowerCase();
      if (emailError.includes("required")) return authText("emailRequired");
      if (emailError.includes("valid")) return authText("invalidEmail");
      if (emailError.includes("taken") || emailError.includes("unique")) return authText("emailExists");
    }
    if (errors.password) {
      const passwordError = String(errors.password[0] || "").toLowerCase();
      if (passwordError.includes("required")) return authText("passwordRequired");
      if (passwordError.includes("8") || passwordError.includes("least")) return authText("passwordMin");
    }
    if (errors.name) return authText("nameRequired");

    return context === "register" ? authText("registration") : authText("incorrect");
  }

  return authText("server");
}
