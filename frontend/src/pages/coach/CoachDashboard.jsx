import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CalendarClock, ClipboardList, NotebookPen, Users } from "lucide-react";
import Badge from "../../components/common/Badge";
import StatCard from "../../components/common/StatCard";
import Table from "../../components/common/Table";
import { fetchCoachDashboard } from "../../store/slices/coachDashboardSlice";

export default function CoachDashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.coachDashboard);
  const stats = data?.stats || {};
  const todaySchedule = data?.today_schedule || [];
  const upcomingSchedule = data?.upcoming_schedule || [];

  useEffect(() => { dispatch(fetchCoachDashboard()); }, [dispatch]);

  return (
    <div className="page-enter grid gap-7">
      <section className="dashboard-hero p-8 text-white shadow-2xl shadow-slate-950/10">
        <p className="section-kicker">Coach dashboard</p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight">{data?.coach?.name || "Coach Workspace"}</h1>
        <p className="mt-2 text-sm text-slate-300">{data?.coach?.speciality || "Manage assigned members, notes, and training plans."}</p>
      </section>

      {error && <div className="rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {loading && <p className="text-center text-sm font-bold text-muted">Loading coach dashboard...</p>}

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard icon={Users} label="Assigned Members" value={stats.assigned_members ?? 0} />
        <StatCard icon={ClipboardList} label="Active Plans" value={stats.active_plans ?? 0} />
        <StatCard icon={CalendarClock} label="Today Schedule" value={stats.today_schedule ?? 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel p-7">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-black">Recent assigned members</h2><Link className="text-xs font-black text-primary" to="/coach/members">View all</Link></div>
          <div className="grid gap-3">
            {(data?.recent_members || []).map((member) => (
              <Link className="flex items-center justify-between rounded border border-line p-4 transition hover:bg-slate-50" key={member.id} to={`/coach/members/${member.id}`}>
                <div><p className="font-black">{member.name}</p><p className="text-xs font-semibold text-muted">{member.email}</p></div>
                <Badge tone="green">Assigned</Badge>
              </Link>
            ))}
            {!(data?.recent_members || []).length && <p className="text-sm font-semibold text-muted">No assigned members yet.</p>}
          </div>
        </div>
        <Table columns={[
          { key: "title", label: "Recent plans" },
          { key: "status", label: "Status", render: (row) => <Badge tone={row.status === "active" ? "green" : "orange"}>{row.status}</Badge> },
        ]} rows={data?.recent_plans || []} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <SchedulePanel title="Today schedule" items={todaySchedule} />
        <SchedulePanel title="Upcoming schedule" items={upcomingSchedule} />
      </div>
    </div>
  );
}

function SchedulePanel({ title, items }) {
  return (
    <div className="panel p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black">{title}</h2>
        <NotebookPen className="h-5 w-5 text-primary" />
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <div className="rounded border border-line bg-slate-50 p-4" key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black">{item.title}</p>
                <p className="mt-1 text-xs font-bold text-muted">{item.schedule_date} at {item.start_time}{item.end_time ? ` - ${item.end_time}` : ""}</p>
                {item.location && <p className="mt-2 text-xs font-bold text-primary">{item.location}</p>}
              </div>
              <Badge tone={item.status === "completed" ? "green" : item.status === "cancelled" ? "red" : "orange"}>{item.status}</Badge>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-sm font-semibold text-muted">No sessions scheduled.</p>}
      </div>
    </div>
  );
}
