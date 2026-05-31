import React from 'react';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Bot, Copy, Search, Sparkles } from "lucide-react";
import Button from "../../components/common/Button";
import { generateReminder } from "../../store/slices/aiSlice";
import { fetchMembers } from "../../store/slices/membersSlice";

export default function AiReminder() {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { member_id: "", language: "english", end_date: "" } });
  const dispatch = useDispatch();
  const { message } = useSelector((s) => s.ai);
  const { items: members, loading: membersLoading } = useSelector((s) => s.members);
  const selectedMemberId = watch("member_id");
  const selectedMember = members.find((member) => String(member.id) === String(selectedMemberId));
  const [memberSearch, setMemberSearch] = useState("");

  const memberResults = members.filter((member) => {
    const value = `${member.name || ""} ${member.email || ""} ${member.phone || ""}`.toLowerCase();
    return !memberSearch || value.includes(memberSearch.toLowerCase());
  }).slice(0, 8);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedMember) return;
    const endDate = selectedMember.active_subscription?.end_date || selectedMember.subscription?.end_date || "";
    setValue("end_date", endDate);
  }, [selectedMember, setValue]);

  const submit = (data) => {
    const member = members.find((item) => String(item.id) === String(data.member_id));
    if (!member) return;

    dispatch(generateReminder({
      member_name: member.name,
      end_date: data.end_date || member.active_subscription?.end_date || "2026-06-01",
      language: data.language,
    }));
  };

  return (
    <div className="page-enter grid gap-7">
      <div>
        <p className="section-kicker">Retention assistant</p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">AI Reminder</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">Generate short, professional renewal reminders. The system creates text only; the admin sends it manually.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form className="panel grid content-start gap-5 p-7" onSubmit={handleSubmit(submit)}>
          <div className="grid h-14 w-14 place-items-center rounded bg-dark text-white"><Bot className="h-6 w-6 text-primary" /></div>
          <label className="grid gap-2 text-xs font-bold text-slate-700">
            Search member
            <div className="flex items-center gap-3 rounded border border-line bg-white px-3.5 py-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                disabled={membersLoading}
                placeholder={membersLoading ? "Loading members..." : "Type member name, email, or phone"}
                type="search"
                value={memberSearch}
                onChange={(event) => {
                  setMemberSearch(event.target.value);
                  setValue("member_id", "");
                }}
              />
            </div>
          </label>
          <input type="hidden" {...register("member_id", { required: true })} />
          <div className="max-h-56 overflow-y-auto rounded border border-line bg-slate-50 p-2">
            {memberResults.length ? memberResults.map((member) => (
              <button
                className={`flex w-full items-center justify-between gap-3 rounded px-3 py-3 text-left transition hover:bg-white hover:shadow-sm ${String(selectedMemberId) === String(member.id) ? "bg-white ring-2 ring-primary/20" : ""}`}
                key={member.id}
                type="button"
                onClick={() => {
                  setValue("member_id", member.id);
                  setMemberSearch(member.name || "");
                }}
              >
                <span>
                  <span className="block text-sm font-black text-slate-900">{member.name}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-slate-500">{member.email || member.phone || "Member"}</span>
                </span>
                <span className="rounded bg-white px-3 py-1 text-xs font-black uppercase text-primary">Select</span>
              </button>
            )) : (
              <p className="px-3 py-4 text-sm font-semibold text-slate-500">No members found.</p>
            )}
          </div>
          <label className="grid gap-2 text-xs font-bold text-slate-700">Language<select className="premium-input rounded px-3.5 py-3 text-sm" {...register("language")}><option value="english">English</option><option value="french">French</option><option value="arabic">Arabic</option></select></label>
          <label className="grid gap-2 text-xs font-bold text-slate-700">
            Subscription end date
            <input className="premium-input rounded px-3.5 py-3 text-sm" type="date" {...register("end_date")} />
          </label>
          <Button><Sparkles className="h-4 w-4" />Generate reminder</Button>
        </form>
        <div className="panel p-7">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-black">Generated message</h2><Button variant="ghost"><Copy className="h-4 w-4" />Copy</Button></div>
          <div className="min-h-72 rounded border border-line bg-slate-50 p-6 text-sm leading-8 text-slate-700">
            {message || "Hello Michael, this is a friendly reminder that your membership will expire soon. Please renew your subscription to continue enjoying the club facilities. We look forward to seeing you at the gym."}
          </div>
        </div>
      </div>
    </div>
  );
}
