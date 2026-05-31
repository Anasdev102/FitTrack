import React from 'react';
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CalendarCheck, CreditCard, Dumbbell, UserRound } from "lucide-react";
import Badge from "../../components/common/Badge";
import StatCard from "../../components/common/StatCard";
import Table from "../../components/common/Table";
import { fetchMemberDashboard } from "../../store/slices/dashboardSlice";
import { formatCurrency } from "../../utils/formatCurrency";

export default function MemberDashboard() {
  const dispatch = useDispatch();
  const location = useLocation();
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
  const assignedCoach = data?.assigned_coach;
  const trainingPlans = data?.training_plans || [];

  useEffect(() => { dispatch(fetchMemberDashboard()); }, [dispatch]);

  useEffect(() => {
    if (location.search === "?section=coach") {
      requestAnimationFrame(() => {
        document.getElementById("my-coach")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.search, data]);

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
      <MyCoachSection coach={assignedCoach} trainingPlans={trainingPlans} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Table columns={[{ key: "date", label: "Recent attendance" }, { key: "time", label: "Check in" }, { key: "status", label: "Status", render: () => <Badge tone="green">Present</Badge> }]} rows={attendanceData} />
        <Table columns={[{ key: "payment_date", label: "Recent payments" }, { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) }, { key: "status", label: "Status", render: (row) => <Badge tone={row.status === "unpaid" ? "orange" : "green"}>{row.status}</Badge> }]} rows={paymentData} />
      </div>
    </div>
  );
}

function MyCoachSection({ coach, trainingPlans }) {
  const coachName = coach?.name || coach?.user?.name;
  const coachImage = coach?.image || coach?.user?.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=300&q=80";
  const activePlans = trainingPlans.filter((plan) => plan.status === "active");

  return (
    <section id="my-coach" className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="panel overflow-hidden p-0">
        {coach ? (
          <div className="grid md:grid-cols-[11rem_1fr]">
            <img className="h-56 w-full object-cover md:h-full" src={coachImage} alt={coachName || "Assigned coach"} />
            <div className="p-6">
              <p className="section-kicker">My Coach</p>
              <h2 className="mt-3 text-2xl font-black">{coachName}</h2>
              <p className="mt-1 text-sm font-bold text-primary">{coach.speciality || "Fitness Coach"}</p>
              {coach.bio && <p className="mt-4 text-sm leading-7 text-muted">{coach.bio}</p>}
              <div className="mt-5 grid gap-3 text-sm font-semibold text-muted">
                {coach.phone && <p>Phone: <span className="text-ink">{coach.phone}</span></p>}
                {coach.user?.email && <p>Email: <span className="text-ink">{coach.user.email}</span></p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <p className="section-kicker">My Coach</p>
            <h2 className="mt-3 text-2xl font-black">No coach assigned yet</h2>
            <p className="mt-3 text-sm leading-7 text-muted">The gym admin has not assigned an approved coach to your account yet. Once assigned, your coach details and plans will appear here.</p>
          </div>
        )}
      </div>

      <div className="panel p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Training plans</p>
            <h2 className="mt-2 text-xl font-black">Coach programs</h2>
          </div>
          <Badge tone={activePlans.length ? "green" : "orange"}>{activePlans.length} active</Badge>
        </div>
        <div className="grid gap-3">
          {trainingPlans.slice(0, 3).map((plan) => (
            <div className="rounded border border-line p-4" key={plan.id}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black">{plan.title}</h3>
                <Badge tone={plan.status === "active" ? "green" : "orange"}>{plan.status}</Badge>
              </div>
              {plan.description && <p className="mt-2 text-sm leading-6 text-muted">{plan.description}</p>}
            </div>
          ))}
          {!trainingPlans.length && <p className="rounded border border-dashed border-line p-5 text-sm font-semibold text-muted">No training plans yet.</p>}
        </div>
      </div>
    </section>
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
