import React from 'react';
import { useEffect, useMemo, useState } from "react";
import Badge from "../../components/common/Badge";
import Table from "../../components/common/Table";
import { coachApi } from "../../api/coachApi";

export default function CoachSchedule() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    coachApi.schedule()
      .then((response) => setItems(response.data.data || []))
      .catch((err) => setError(err.response?.data?.message || "Could not load schedule."))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayItems = useMemo(() => items.filter((item) => item.schedule_date === today), [items, today]);
  const upcomingItems = useMemo(() => items.filter((item) => item.schedule_date > today), [items, today]);

  const columns = [
    { key: "title", label: "Session", render: (row) => <span className="font-black">{row.title}</span> },
    { key: "schedule_date", label: "Date" },
    { key: "start_time", label: "Start" },
    { key: "end_time", label: "End", render: (row) => row.end_time || "-" },
    { key: "location", label: "Location", render: (row) => row.location || "-" },
    { key: "status", label: "Status", render: (row) => <Badge tone={row.status === "completed" ? "green" : row.status === "cancelled" ? "red" : "orange"}>{row.status}</Badge> },
  ];

  return (
    <div className="page-enter grid gap-7">
      <section className="dashboard-hero p-8 text-white shadow-2xl shadow-slate-950/10">
        <p className="section-kicker">Coach schedule</p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight">My schedule</h1>
        <p className="mt-2 text-sm text-slate-300">View today and upcoming sessions assigned by admin.</p>
      </section>

      {error && <div className="rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {loading && <p className="text-center text-sm font-bold text-muted">Loading schedule...</p>}

      <div className="grid gap-6 xl:grid-cols-2">
        <Table columns={columns} rows={todayItems} />
        <Table columns={columns} rows={upcomingItems} />
      </div>
    </div>
  );
}
