import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Banknote, PlayCircle, Search, XCircle } from "lucide-react";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import { activateSubscription, confirmCashPayment, fetchSubscriptions, rejectSubscription } from "../../store/slices/subscriptionsSlice";
import { formatCurrency } from "../../utils/formatCurrency";

const statusTabs = ["all", "pending", "active", "expired", "rejected", "cancelled"];

export default function Subscriptions() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.subscriptions);
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchSubscriptions(status === "all" ? {} : { status }));
  }, [dispatch, status]);

  const rows = useMemo(() => items.filter((item) => {
    const value = `${item.member?.name || ""} ${item.member?.email || ""} ${item.type || ""} ${item.status || ""}`.toLowerCase();
    return !search || value.includes(search.toLowerCase());
  }), [items, search]);

  const refresh = () => dispatch(fetchSubscriptions(status === "all" ? {} : { status }));

  const confirmPayment = async (id) => {
    try {
      await dispatch(confirmCashPayment(id)).unwrap();
      toast.success("Cash payment confirmed.");
      refresh();
    } catch (err) {
      toast.error(err || "Could not confirm cash payment.");
    }
  };

  const activate = async (id) => {
    try {
      await dispatch(activateSubscription(id)).unwrap();
      toast.success("Subscription activated.");
      refresh();
    } catch (err) {
      toast.error(err || "Could not activate subscription.");
    }
  };

  const reject = async (id) => {
    try {
      await dispatch(rejectSubscription(id)).unwrap();
      toast.success("Subscription rejected.");
      refresh();
    } catch (err) {
      toast.error(err || "Could not reject request.");
    }
  };

  return (
    <div className="page-enter grid gap-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="section-kicker">Approval workflow</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">Subscription Requests</h1>
          <p className="mt-2 text-sm text-muted">Members request plans online, pay cash at reception, then admin confirms payment and activates access.</p>
        </div>
      </div>

      {error && <div className="rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

      <div className="panel flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <button
              className={`rounded px-4 py-2 text-xs font-black uppercase transition ${status === tab ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              key={tab}
              type="button"
              onClick={() => setStatus(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex min-w-72 items-center gap-2 rounded border border-line bg-white px-4 py-3">
          <Search className="h-4 w-4 text-muted" />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Search member or plan..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </div>

      <Table
        columns={[
          { key: "member", label: "Member", render: (row) => <div><p className="font-black text-slate-900">{row.member?.name}</p><p className="text-xs font-semibold text-muted">{row.member?.email}</p></div> },
          { key: "type", label: "Plan", render: (row) => <span className="font-black capitalize">{row.plan_name || row.type}</span> },
          { key: "price", label: "Price", render: (row) => formatCurrency(row.price) },
          { key: "requested_at", label: "Requested", render: (row) => row.requested_at?.slice(0, 10) || "-" },
          { key: "payment_deadline", label: "Deadline", render: (row) => row.payment_deadline ? row.payment_deadline.slice(0, 16) : "-" },
          { key: "remaining", label: "Remaining", render: (row) => paymentDeadlineLabel(row) },
          { key: "payment_method", label: "Method", render: () => <Badge tone="orange">cash</Badge> },
          { key: "status", label: "Status", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
          { key: "payment_status", label: "Payment", render: (row) => <Badge tone={row.payment_status === "paid" ? "green" : "orange"}>{row.payment_status}</Badge> },
          { key: "start_date", label: "Start" },
          { key: "end_date", label: "End" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => row.status === "pending" ? (
              <div className="flex flex-wrap gap-2">
                {row.payment_status !== "paid" && !deadlinePassed(row) && <Button className="px-3 py-2" onClick={() => confirmPayment(row.id)}><Banknote className="h-4 w-4" />Confirm Cash Payment</Button>}
                {row.payment_status !== "paid" && deadlinePassed(row) && <span className="rounded bg-red-50 px-3 py-2 text-xs font-black uppercase text-red-700">Expired payment deadline</span>}
                {row.payment_status === "paid" && <Button className="px-3 py-2" onClick={() => activate(row.id)}><PlayCircle className="h-4 w-4" />Activate Subscription</Button>}
                {row.payment_status !== "paid" && <Button className="px-3 py-2" variant="ghost" onClick={() => reject(row.id)}><XCircle className="h-4 w-4" />Reject</Button>}
              </div>
            ) : <span className="text-xs font-bold text-muted">No action</span>,
          },
        ]}
        rows={rows}
      />
      {loading && <p className="text-center text-sm font-bold text-muted">Loading requests...</p>}
    </div>
  );
}

function statusTone(status) {
  if (status === "active") return "green";
  if (status === "pending") return "orange";
  if (status === "rejected" || status === "cancelled") return "red";
  return "orange";
}

function deadlinePassed(row) {
  return row.payment_status === "unpaid" && row.payment_deadline && new Date(row.payment_deadline) < new Date();
}

function paymentDeadlineLabel(row) {
  if (!row.payment_deadline || row.payment_status === "paid") return "-";
  const diffMs = new Date(row.payment_deadline).getTime() - Date.now();
  if (diffMs <= 0) return "Expired payment deadline";
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}
