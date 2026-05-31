import React from 'react';
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Badge from "../../components/common/Badge";
import Table from "../../components/common/Table";
import { fetchCoachMember } from "../../store/slices/coachMembersSlice";
import CoachNotes from "./CoachNotes";
import TrainingPlans from "./TrainingPlans";

export default function MemberDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, attendances, loading, error } = useSelector((state) => state.coachMembers);

  useEffect(() => { dispatch(fetchCoachMember(id)); }, [dispatch, id]);

  return (
    <div className="page-enter grid gap-7">
      {error && <div className="rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {loading && <p className="text-center text-sm font-bold text-muted">Loading member...</p>}

      <div className="dashboard-hero p-8 text-white shadow-2xl shadow-slate-950/10">
        <p className="section-kicker">Assigned member</p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight">{selected?.name || "Member"}</h1>
        <p className="mt-2 text-sm text-slate-300">{selected?.email} {selected?.phone ? `- ${selected.phone}` : ""}</p>
        <div className="mt-5"><Badge tone={selected?.active_subscription?.status === "active" ? "green" : "orange"}>{selected?.active_subscription?.status || "no active subscription"}</Badge></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Table columns={[
          { key: "date", label: "Attendance date" },
          { key: "time", label: "Check in" },
          { key: "status", label: "Status", render: () => <Badge tone="green">Present</Badge> },
        ]} rows={attendances} />
        <CoachNotes memberId={id} />
      </div>
      <TrainingPlans memberId={id} />
    </div>
  );
}
