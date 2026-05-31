import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CalendarCheck, CreditCard, Dumbbell, UserRound } from "lucide-react";
import Badge from "../../components/common/Badge";
import StatCard from "../../components/common/StatCard";
import Table from "../../components/common/Table";
import { fetchMemberDashboard } from "../../store/slices/dashboardSlice";
import { formatCurrency } from "../../utils/formatCurrency";

export default function MemberDashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);
  const apiSubscription = data?.subscription;
  const apiUser = user || data?.user;
  const planName = apiSubscription?.type;
  const memberName = apiUser?.name || "Member";
  const memberId = apiUser?.id ? `MEM-${String(apiUser.id).padStart(5, "0")}` : "MEM-00000";
  const renewalDate = apiSubscription?.end_date || "-";
  const subscriptionActive = apiSubscription?.status === "active";
  const subscriptionStatus = apiSubscription?.status || "none";
  const attendanceData = data?.attendances || [];
  const paymentData = data?.payments || [];

  useEffect(() => { dispatch(fetchMemberDashboard()); }, [dispatch]);

  return (
    <div className="page-enter grid gap-7">
      <div className="dark-card rounded-lg p-8 text-white shadow-2xl shadow-slate-950/15">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">Membership card</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight">{memberName}</h1>
            <p className="mt-2 text-sm text-slate-300">ID {memberId}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 rounded bg-white/10 p-4 backdrop-blur">
            <div><p className="text-xs text-slate-300">Plan</p><p className="mt-1 font-black">{planName || "Not selected"}</p></div>
            <div><p className="text-xs text-slate-300">Renewal</p><p className="mt-1 font-black">{renewalDate}</p></div>
            <div><p className="text-xs text-slate-300">Status</p><div className="mt-1"><Badge tone={statusTone(subscriptionStatus)}>{subscriptionStatus === "none" ? "No plan" : subscriptionStatus}</Badge></div></div>
          </div>
        </div>
      </div>
      <SubscriptionNotice subscription={apiSubscription} />
      {error && <div className="rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {loading && <p className="text-center text-sm font-bold text-muted">Loading member dashboard...</p>}
      {!subscriptionActive && (
        <div className="panel flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-black">Choose your membership plan</h2>
            <p className="mt-1 text-sm text-muted">You logged in before selecting a subscription. Pick one to activate your account.</p>
          </div>
          <Link className="inline-flex justify-center rounded-full bg-primary px-5 py-3 text-sm font-black text-white" to="/member/subscription">Choose plan</Link>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard icon={Dumbbell} label="Plan" value={planName || "Pending"} />
        <StatCard icon={CreditCard} label="Payment" value={apiSubscription?.payment_status || "unpaid"} />
        <StatCard icon={CalendarCheck} label="Visits" value={attendanceData.length} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Table columns={[{ key: "date", label: "Recent attendance" }, { key: "time", label: "Check in" }, { key: "status", label: "Status", render: () => <Badge tone="green">Present</Badge> }]} rows={attendanceData} />
        <Table columns={[{ key: "payment_date", label: "Recent payments" }, { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) }, { key: "status", label: "Status", render: (row) => <Badge tone={row.status === "unpaid" ? "orange" : "green"}>{row.status}</Badge> }]} rows={paymentData} />
      </div>
    </div>
  );
}

function SubscriptionNotice({ subscription }) {
  if (!subscription) return null;
  if (subscription.status === "pending") {
    return <div className="rounded border border-amber-100 bg-amber-50 p-5 text-sm font-bold text-amber-800">{subscription.payment_status === "paid" ? "Cash payment confirmed. Ready to activate." : `Please pay in cash at the gym reception before ${formatDeadline(subscription.payment_deadline)}.`}</div>;
  }
  if (subscription.status === "active") {
    return <div className="rounded border border-green-100 bg-green-50 p-5 text-sm font-bold text-green-800">Your subscription is active until {subscription.end_date}. {subscription.remaining_days} days remaining.</div>;
  }
  if (subscription.status === "expired") {
    return <div className="rounded border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">Your subscription has expired.</div>;
  }
  if (subscription.status === "rejected") {
    return <div className="rounded border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">Your subscription request was rejected.</div>;
  }
  if (subscription.status === "cancelled") {
    return <div className="rounded border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">Your subscription request was cancelled because payment was not received within 48 hours.</div>;
  }
  return null;
}

function statusTone(status) {
  if (status === "active") return "green";
  if (status === "pending") return "orange";
  if (status === "rejected" || status === "expired" || status === "cancelled") return "red";
  return "orange";
}

function formatDeadline(value) {
  if (!value) return "the payment deadline";
  return new Date(value).toLocaleString();
}
