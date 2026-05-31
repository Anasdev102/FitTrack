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

export function reminderMessage({ member_name = "Michael Johnson", end_date = "2026-06-01", language = "english" }) {
  const messages = {
    english: `Hello ${member_name}, this is a friendly reminder that your membership will expire on ${end_date}. Please renew your subscription to continue enjoying the club facilities.`,
    french: `Bonjour ${member_name}, votre abonnement expire le ${end_date}. Merci de le renouveler pour continuer a profiter du club.`,
    arabic: `مرحبا ${member_name}، نذكركم بأن الاشتراك سينتهي بتاريخ ${end_date}. يرجى تجديده لمواصلة الاستفادة من النادي.`,
  };

  return messages[language] || messages.english;
}
