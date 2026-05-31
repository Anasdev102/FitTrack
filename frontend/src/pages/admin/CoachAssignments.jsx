import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import { coachAssignmentsApi } from "../../api/coachAssignmentsApi";
import { coachesApi } from "../../api/coachesApi";
import { membersApi } from "../../api/membersApi";

export default function CoachAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ coach_id: "", member_id: "" });

  const load = () => {
    coachAssignmentsApi.list().then((response) => setAssignments(response.data.data || []));
    coachesApi.list().then((response) => setCoaches(response.data.data || []));
    membersApi.list().then((response) => setMembers(response.data.data || []));
  };

  useEffect(() => { load(); }, []);

  const create = async (event) => {
    event.preventDefault();
    try {
      await coachAssignmentsApi.create(form);
      toast.success("Assignment request created.");
      setForm({ coach_id: "", member_id: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create assignment.");
    }
  };

  const approve = async (id) => {
    await coachAssignmentsApi.approve(id);
    toast.success("Assignment approved.");
    load();
  };

  const reject = async (id) => {
    await coachAssignmentsApi.reject(id);
    toast.success("Assignment rejected.");
    load();
  };

  return (
    <div className="page-enter grid gap-7">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Coach access control</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Coach Assignments</h1>
        <p className="mt-2 text-sm text-muted">Only approved assignments are visible in the coach dashboard.</p>
      </div>

      <form className="panel grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto]" onSubmit={create}>
        <select className="premium-input rounded px-3.5 py-3 text-sm" value={form.coach_id} onChange={(event) => setForm({ ...form, coach_id: event.target.value })} required>
          <option value="">Select coach</option>
          {coaches.map((coach) => <option key={coach.id} value={coach.id}>{coach.name}</option>)}
        </select>
        <select className="premium-input rounded px-3.5 py-3 text-sm" value={form.member_id} onChange={(event) => setForm({ ...form, member_id: event.target.value })} required>
          <option value="">Select member</option>
          {members.map((member) => <option key={member.id} value={member.id}>{member.name} - {member.email}</option>)}
        </select>
        <Button type="submit">Create assignment</Button>
      </form>

      <Table
        columns={[
          { key: "coach", label: "Coach", render: (row) => row.coach?.name || row.coach?.user?.name || "-" },
          { key: "member", label: "Member", render: (row) => row.member?.name || "-" },
          { key: "status", label: "Status", render: (row) => <Badge tone={row.status === "approved" ? "green" : row.status === "rejected" ? "red" : "orange"}>{row.status}</Badge> },
          { key: "request_date", label: "Requested" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => row.status === "pending" ? (
              <div className="flex gap-2">
                <Button className="px-3 py-2" onClick={() => approve(row.id)}>Approve</Button>
                <Button className="px-3 py-2" variant="ghost" onClick={() => reject(row.id)}>Reject</Button>
              </div>
            ) : <span className="text-xs font-bold text-muted">No action</span>,
          },
        ]}
        rows={assignments}
      />
    </div>
  );
}
