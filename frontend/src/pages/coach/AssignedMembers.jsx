import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import Badge from "../../components/common/Badge";
import Table from "../../components/common/Table";
import { fetchCoachMembers } from "../../store/slices/coachMembersSlice";

export default function AssignedMembers() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.coachMembers);
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(fetchCoachMembers()); }, [dispatch]);

  const rows = useMemo(() => items.filter((member) => {
    const value = `${member.name || ""} ${member.email || ""} ${member.phone || ""}`.toLowerCase();
    return !search || value.includes(search.toLowerCase());
  }), [items, search]);

  return (
    <div className="page-enter grid gap-7">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Approved assignments</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Assigned Members</h1>
      </div>
      {error && <div className="rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      <div className="panel flex max-w-xl items-center gap-2 p-4">
        <Search className="h-4 w-4 text-muted" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder="Search assigned members..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <Table
        columns={[
          { key: "name", label: "Member", render: (row) => <Link className="font-black text-primary" to={`/coach/members/${row.id}`}>{row.name}</Link> },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "active_subscription", label: "Subscription", render: (row) => <Badge tone={row.active_subscription?.status === "active" ? "green" : "orange"}>{row.active_subscription?.status || "none"}</Badge> },
        ]}
        rows={rows}
      />
      {loading && <p className="text-center text-sm font-bold text-muted">Loading assigned members...</p>}
    </div>
  );
}
