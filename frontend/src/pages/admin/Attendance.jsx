import React from 'react';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Plus, Search, UserRound, X } from "lucide-react";
import toast from "react-hot-toast";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import { fetchAttendance, markAttendance } from "../../store/slices/attendanceSlice";
import { fetchMembers } from "../../store/slices/membersSlice";

export default function Attendance() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.attendance);
  const { items: members, loading: membersLoading } = useSelector((s) => s.members);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { user_id: "" } });

  useEffect(() => {
    dispatch(fetchAttendance());
    dispatch(fetchMembers());
  }, [dispatch]);

  const rows = items.filter((item) => {
    const searchMatch = !search || JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
    const dateMatch = !date || item.date === date;
    return searchMatch && dateMatch;
  });

  const openModal = () => {
    reset({ user_id: "" });
    setMemberSearch("");
    setSelectedMember(null);
    setModalOpen(true);
  };

  const memberResults = members.filter((member) => {
    const value = `${member.name || ""} ${member.email || ""} ${member.phone || ""}`.toLowerCase();
    return !memberSearch || value.includes(memberSearch.toLowerCase());
  }).slice(0, 8);

  const submit = async (data) => {
    if (!data.user_id) {
      toast.error("Choose a member first.");
      return;
    }

    try {
      await dispatch(markAttendance({ user_id: data.user_id })).unwrap();
      await dispatch(fetchAttendance());
      toast.success("Attendance marked");
      setModalOpen(false);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not mark attendance. Choose a member and try again.");
    }
  };

  return (
    <div className="page-enter grid gap-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Daily flow</p><h1 className="mt-2 text-3xl font-black tracking-tight">Attendance</h1></div>
        <Button onClick={openModal}><Plus className="h-4 w-4" />Mark Attendance</Button>
      </div>
      {error && <div className="rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="panel p-6"><p className="text-xs font-black uppercase tracking-wide text-muted">Today</p><p className="mt-3 text-3xl font-black">{items.length || 0}</p></div>
        <div className="panel p-6"><p className="text-xs font-black uppercase tracking-wide text-muted">Search</p><p className="mt-3 text-3xl font-black">{rows.length}</p></div>
        <div className="panel p-6"><p className="text-xs font-black uppercase tracking-wide text-muted">Duplicate control</p><p className="mt-3 text-3xl font-black text-primary">On</p></div>
      </div>
      <div className="panel flex flex-wrap gap-3 p-4">
        <div className="flex items-center gap-2 rounded border border-line bg-white px-4 py-3"><Calendar className="h-4 w-4 text-muted" /><input className="bg-transparent text-sm outline-none" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div>
        <div className="flex max-w-md flex-1 items-center gap-2 rounded border border-line bg-white px-4 py-3"><Search className="h-4 w-4 text-muted" /><input className="w-full bg-transparent text-sm outline-none" placeholder="Search member..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        {(search || date) && <button className="rounded px-4 py-3 text-sm font-black uppercase tracking-wide text-primary" type="button" onClick={() => { setSearch(""); setDate(""); }}>Clear</button>}
      </div>
      <Table columns={[
        { key: "member", label: "Member", render: (r) => <span className="font-black">{r.member?.name}</span> },
        { key: "date", label: "Date" },
        { key: "time", label: "Check in" },
        { key: "status", label: "Status", render: () => <Badge tone="green">Present</Badge> },
      ]} rows={rows} />
      {loading && <p className="text-center text-sm font-bold text-muted">Loading...</p>}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4">
          <form className="panel flex max-h-[90vh] w-[95vw] max-w-3xl flex-col overflow-hidden sm:w-[90vw] lg:w-full" onSubmit={handleSubmit(submit)}>
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-7">
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Check-in</p><h2 className="mt-2 text-2xl font-black">Mark Attendance</h2><p className="mt-1 text-sm text-muted">Choose the member by name.</p></div>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500" type="button" onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:max-h-[70vh] sm:p-7">
              <label className="grid gap-2 text-xs font-bold text-slate-700">
                Search member
                <div className="flex items-center gap-3 rounded border border-line bg-white px-3.5 py-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
                  <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                    disabled={membersLoading}
                    placeholder={membersLoading ? "Loading members..." : "Type member name, email, or phone"}
                    type="search"
                    value={memberSearch}
                    onChange={(event) => {
                      setMemberSearch(event.target.value);
                      setSelectedMember(null);
                      reset({ user_id: "" });
                    }}
                  />
                </div>
              </label>
              <input type="hidden" {...register("user_id", { required: true })} />

              {selectedMember && (
                <div className="mt-3 rounded border border-orange-200 bg-orange-50 px-4 py-3 text-sm">
                  <p className="font-black text-ink">{selectedMember.name}</p>
                  <p className="mt-1 text-xs font-semibold text-muted">{selectedMember.email || selectedMember.phone || "Selected member"}</p>
                </div>
              )}

              <div className="mt-4 max-h-64 overflow-y-auto rounded border border-line bg-slate-50 p-2">
                {memberResults.length ? memberResults.map((member) => (
                  <button
                    className="flex w-full items-center justify-between gap-3 rounded px-3 py-3 text-left transition hover:bg-white hover:shadow-sm"
                    key={member.id}
                    type="button"
                    onClick={() => {
                      setSelectedMember(member);
                      setMemberSearch(member.name || "");
                      reset({ user_id: member.id });
                    }}
                  >
                    <span>
                      <span className="block text-sm font-black text-slate-900">{member.name}</span>
                      <span className="mt-0.5 block text-xs font-semibold text-slate-500">{member.email || member.phone || "Member"}</span>
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-primary">Select</span>
                  </button>
                )) : (
                  <p className="px-3 py-4 text-sm font-semibold text-slate-500">No members found.</p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white p-4 sm:p-5"><Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Mark present</Button></div>
          </form>
        </div>
      )}
    </div>
  );
}
