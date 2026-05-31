import Badge from "../../components/common/Badge";
import ResourcePage from "./ResourcePage";
import { createMember, deleteMember, fetchMembers, updateMember } from "../../store/slices/membersSlice";
export default function Members() {
  return (
    <ResourcePage
      title="Members"
      actionLabel="Add Member"
      slice="members"
      fetchAction={fetchMembers}
      createAction={createMember}
      updateAction={updateMember}
      deleteAction={deleteMember}
      fields={[
        { name: "name", label: "Full name" },
        { name: "email", label: "Email", type: "email" },
        { name: "phone", label: "Phone" },
        { name: "password", label: "Password", type: "password", defaultValue: "password" },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name", render: (r) => <span className="font-black text-slate-900">{r.name || "Michael Johnson"}</span> },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        {
          key: "active_subscription",
          label: "Status",
          render: (r) => (
            <Badge
              tone={
                r.active_subscription?.status === "active" ? "green" : "red"
              }
            >
              {r.active_subscription?.status || "Active"}
            </Badge>
          ),
        },
      ]}
    />
  );
}
