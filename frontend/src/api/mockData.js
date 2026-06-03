export const mockUsers = [
  { id: 1, name: "Michael Johnson", email: "michael@email.com", phone: "+212 600 111111", role: "member", active_subscription: { status: "active", type: "monthly" } },
  { id: 2, name: "Sarah Williams", email: "sarah@email.com", phone: "+212 600 222222", role: "member", active_subscription: { status: "active", type: "yearly" } },
  { id: 3, name: "David Brown", email: "david@email.com", phone: "+212 600 333333", role: "member", active_subscription: { status: "active", type: "quarterly" } },
  { id: 4, name: "Emma Davis", email: "emma@email.com", phone: "+212 600 444444", role: "member", active_subscription: { status: "expired", type: "monthly" } },
];

export const mockDashboard = {
  stats: {
    members: 256,
    active_subscriptions: 189,
    monthly_revenue: 15890,
    coaches: 4,
    attendance_today: 45,
  },
  recent_members: mockUsers,
  recent_payments: [
    { id: 1, member: mockUsers[0], amount: 120, method: "card", status: "paid", payment_date: "2026-05-20" },
    { id: 2, member: mockUsers[1], amount: 80, method: "cash", status: "paid", payment_date: "2026-05-20" },
  ],
  payments_chart: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => ({
    month,
    revenue: [1200, 2500, 2100, 4200, 3300, 5200, 2800, 6100, 6800, 5600, 6400, 8200][index],
  })),
};

export const mockMemberDashboard = {
  user: { id: 9, name: "John Doe", email: "john@email.com", phone: "+212 600 123456", role: "member" },
  subscription: { id: 1, type: "Elite", price: 79, start_date: "2026-05-01", end_date: "2026-06-01", status: "active" },
  payments: [
    { id: 1, amount: 120, method: "card", status: "paid", payment_date: "2026-05-01" },
    { id: 2, amount: 120, method: "cash", status: "paid", payment_date: "2026-04-01" },
  ],
  attendances: [
    { id: 1, date: "2026-05-20", time: "08:15 AM" },
    { id: 2, date: "2026-05-18", time: "07:30 AM" },
  ],
};

export const mockResources = {
  members: mockUsers,
  subscriptions: [
    { id: 1, member: mockUsers[0], type: "monthly", price: 49, start_date: "2026-05-01", end_date: "2026-06-01", status: "active" },
    { id: 2, member: mockUsers[1], type: "yearly", price: 499, start_date: "2026-01-01", end_date: "2027-01-01", status: "active" },
    { id: 3, member: mockUsers[3], type: "monthly", price: 49, start_date: "2026-03-01", end_date: "2026-04-01", status: "expired" },
  ],
  payments: [
    { id: 1, member: mockUsers[0], amount: 120, method: "Credit Card", status: "paid", payment_date: "2026-05-20" },
    { id: 2, member: mockUsers[1], amount: 80, method: "Cash", status: "paid", payment_date: "2026-05-20" },
    { id: 3, member: mockUsers[3], amount: 120, method: "Bank Transfer", status: "unpaid", payment_date: "2026-05-19" },
  ],
  coaches: [
    { id: 1, name: "Nora Atlas", phone: "+212 600 555555", speciality: "Strength", salary: 7000 },
    { id: 2, name: "Adam Vega", phone: "+212 600 666666", speciality: "Conditioning", salary: 6500 },
    { id: 3, name: "Maya Stone", phone: "+212 600 777777", speciality: "Mobility", salary: 6200 },
  ],
};

export const mockAttendance = [
  { id: 1, member: { name: "Michael Johnson" }, date: "2026-05-22", time: "08:15 AM" },
  { id: 2, member: { name: "Sarah Williams" }, date: "2026-05-22", time: "08:30 AM" },
  { id: 3, member: { name: "David Brown" }, date: "2026-05-22", time: "09:00 AM" },
  { id: 4, member: { name: "Emma Davis" }, date: "2026-05-22", time: "09:45 AM" },
];

export function reminderMessage({
  member_name = "Michael Johnson",
  end_date = "2026-06-01",
  language = "en",
  reminder_type = "renewal",
  plan_name = "membership",
  amount = "200",
  payment_deadline = "2026-06-03 18:00",
}) {
  const messages = {
    pending_payment: {
      en: `Hello ${member_name}, your ${plan_name} subscription request is pending. Please visit the gym reception before ${payment_deadline} to pay ${amount} MAD in cash and activate your membership.`,
      fr: `Bonjour ${member_name}, votre demande d'abonnement ${plan_name} est en attente. Merci de passer a l'accueil avant le ${payment_deadline} pour regler ${amount} MAD en especes et activer votre abonnement.`,
      ar: `مرحبا ${member_name}، طلب اشتراكك في خطة ${plan_name} مازال في انتظار الأداء. المرجو زيارة استقبال القاعة قبل ${payment_deadline} لأداء مبلغ ${amount} درهم نقدا وتفعيل الاشتراك.`,
    },
    expiring_soon: {
      en: `Hello ${member_name}, your ${plan_name} subscription expires on ${end_date}. You can visit the reception to renew it in cash.`,
      fr: `Bonjour ${member_name}, votre abonnement ${plan_name} expire le ${end_date}. Vous pouvez passer a l'accueil pour le renouveler en especes.`,
      ar: `مرحبا ${member_name}، اشتراكك في خطة ${plan_name} سينتهي بتاريخ ${end_date}. يمكنك زيارة استقبال القاعة لتجديد الاشتراك نقدا.`,
    },
    expired: {
      en: `Hello ${member_name}, your ${plan_name} subscription expired on ${end_date}. Please visit the reception to renew it.`,
      fr: `Bonjour ${member_name}, votre abonnement ${plan_name} a expire le ${end_date}. Merci de passer a l'accueil pour le renouveler.`,
      ar: `مرحبا ${member_name}، اشتراكك في خطة ${plan_name} انتهى بتاريخ ${end_date}. المرجو زيارة استقبال القاعة لتجديد الاشتراك.`,
    },
    renewal: {
      en: `Hello ${member_name}, you can renew your ${plan_name} subscription at the gym reception. Payment is accepted in cash only.`,
      fr: `Bonjour ${member_name}, vous pouvez renouveler votre abonnement ${plan_name} a l'accueil de la salle. Le paiement se fait uniquement en especes.`,
      ar: `مرحبا ${member_name}، يمكنك تجديد اشتراكك في خطة ${plan_name} عبر استقبال القاعة. الأداء يتم نقدا فقط.`,
    },
    cancelled: {
      en: `Hello ${member_name}, your subscription request was cancelled because the cash payment was not completed within the deadline. You can submit a new request from the platform.`,
      fr: `Bonjour ${member_name}, votre demande d'abonnement a ete annulee car le paiement en especes n'a pas ete effectue dans le delai prevu. Vous pouvez creer une nouvelle demande depuis la plateforme.`,
      ar: `مرحبا ${member_name}، تم إلغاء طلب اشتراكك لأن الأداء النقدي لم يتم داخل المهلة المحددة. يمكنك إرسال طلب جديد من المنصة.`,
    },
    rejected: {
      en: `Hello ${member_name}, your subscription request was rejected. Please contact the gym reception for more information or submit a new request from the platform.`,
      fr: `Bonjour ${member_name}, votre demande d'abonnement a ete refusee. Merci de contacter l'accueil de la salle pour plus d'informations ou de soumettre une nouvelle demande depuis la plateforme.`,
      ar: `مرحبا ${member_name}، تم رفض طلب اشتراكك. المرجو التواصل مع استقبال القاعة لمزيد من المعلومات أو إرسال طلب جديد من المنصة.`,
    },
  };

  return messages[reminder_type]?.[language] || messages.renewal.en;
}
