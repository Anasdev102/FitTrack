import React from 'react';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, CreditCard, Sparkles, UserCheck, Users } from "lucide-react";
import Badge from "../../components/common/Badge";
import StatCard from "../../components/common/StatCard";
import Table from "../../components/common/Table";
import { fetchDashboard } from "../../store/slices/dashboardSlice";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.dashboard);
  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);
  const stats = data?.stats || {};
  const membershipMix = data?.membership_mix || {};
  const activePercent = membershipMix.active?.percent ?? 0;

  return (
    <div className="page-enter grid gap-8">
      {loading && !data && <DashboardLoadingCards />}
      <section className="dashboard-hero p-8 text-white shadow-2xl shadow-slate-950/10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded bg-primary px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white"><Sparkles className="h-4 w-4" />Morning brief</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-black uppercase tracking-tight md:text-5xl">Private club control room.</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">Monitor attendance, active memberships, recent payments, and renewal risk from one refined workspace.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded bg-white/10 p-4"><p className="text-2xl font-black">{stats.attendance_today ?? 0}</p><p className="text-xs text-slate-300">Check-ins</p></div>
            <div className="rounded bg-white/10 p-4"><p className="text-2xl font-black">{stats.renewals_this_week ?? 0}</p><p className="text-xs text-slate-300">Renewals</p></div>
            <div className="rounded bg-white/10 p-4"><p className="text-2xl font-black">{stats.coaches ?? 0}</p><p className="text-xs text-slate-300">Coaches</p></div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard icon={Users} label="Members" value={stats.members ?? 0} />
        <StatCard icon={UserCheck} label="Active Plans" value={stats.active_subscriptions ?? 0} />
        <StatCard icon={CreditCard} label="Revenue" value={formatCurrency(stats.monthly_revenue ?? 0)} />
        <StatCard icon={CalendarCheck} label="Attendance" value={stats.attendance_today ?? 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="panel p-7">
          <div className="mb-8 flex items-center justify-between">
            <div><h2 className="text-lg font-black">Revenue momentum</h2><p className="mt-1 text-sm text-muted">Monthly paid revenue trend</p></div>
            <button className="rounded border border-line bg-white px-4 py-2 text-xs font-black text-slate-600">2026</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.payments_chart || []}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#F36100" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#F36100" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area dataKey="revenue" fill="url(#revenueFill)" stroke="#F36100" strokeWidth={3} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-7">
          <div className="mb-6 flex items-center justify-between"><h2 className="text-lg font-black">Recent members</h2><button className="text-xs font-black text-primary">View all</button></div>
          <div className="grid gap-4">
            {(data?.recent_members || []).map((member, index) => (
              <div className="flex items-center justify-between rounded border border-line p-3" key={member.email || index}>
                <div className="flex items-center gap-3">
                  <img className="h-11 w-11 rounded object-cover" src={`https://i.pravatar.cc/90?img=${index + 18}`} alt="" />
                  <div><p className="text-sm font-black">{member.name}</p><p className="text-xs font-bold text-muted">{member.email}</p></div>
                </div>
                <Badge tone="green">Active</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Table columns={[
          { key: "name", label: "Member" },
          { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount ?? 0) },
          { key: "method", label: "Method" },
          { key: "status", label: "Status", render: (row) => <Badge tone={row.status === "paid" ? "green" : "orange"}>{row.status}</Badge> },
          { key: "date", label: "Date" },
        ]} rows={(data?.recent_payments || []).map((payment) => ({
          ...payment,
          name: payment.member?.name || "Unknown member",
          date: payment.payment_date,
        }))} />
        <div className="panel p-7">
          <h2 className="text-lg font-black">Membership mix</h2>
          <p className="mt-1 text-sm text-muted">Active vs expired plans</p>
          <div className="mt-8 grid place-items-center">
            <div
              className="grid h-52 w-52 place-items-center rounded-full shadow-inner"
              style={{ background: `conic-gradient(#22C55E 0 ${activePercent}%, #F36100 ${activePercent}% ${activePercent + (membershipMix.expired?.percent ?? 0)}%, #EF4444 ${activePercent + (membershipMix.expired?.percent ?? 0)}% 100%)` }}
            >
              <div className="grid h-32 w-32 place-items-center rounded-full bg-white text-center"><span className="text-3xl font-black">{activePercent}%</span></div>
            </div>
          </div>
          <div className="mt-7 grid gap-3 text-sm font-bold">
            <div className="flex items-center justify-between"><span className="text-green-600">Active</span><span>{membershipMix.active?.count ?? 0}</span></div>
            <div className="flex items-center justify-between"><span className="text-primary">Expired</span><span>{membershipMix.expired?.count ?? 0}</span></div>
            <div className="flex items-center justify-between"><span className="text-amber-600">Pending</span><span>{membershipMix.pending?.count ?? 0}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardLoadingCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {["Loading Member Requests...", "Loading Coach Assignments...", "Loading Attendance..."].map((label) => (
        <div className="panel p-6" key={label}>
          <div className="h-3 w-20 animate-pulse rounded bg-orange-100" />
          <p className="mt-5 text-sm font-black uppercase tracking-wide text-muted">{label}</p>
          <div className="mt-5 h-10 w-24 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
