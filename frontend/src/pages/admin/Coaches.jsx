import ResourcePage from "./ResourcePage";
import { createCoach, deleteCoach, fetchCoaches, updateCoach } from "../../store/slices/coachesSlice";
import { formatCurrency } from "../../utils/formatCurrency";
export default function Coaches() {
  return (
    <ResourcePage
      title="Coaches"
      actionLabel="Add Coach"
      slice="coaches"
      fetchAction={fetchCoaches}
      createAction={createCoach}
      updateAction={updateCoach}
      deleteAction={deleteCoach}
      fields={[
        { name: "name", label: "Full name" },
        { name: "email", label: "Login email", type: "email" },
        { name: "password", label: "Password", type: "password", defaultValue: "password123" },
        { name: "phone", label: "Phone" },
        { name: "speciality", label: "Speciality" },
        { name: "salary", label: "Salary", type: "number", defaultValue: "5000" },
        { name: "bio", label: "Bio", type: "textarea" },
        { name: "image", label: "Image URL" },
      ]}
      columns={[
        { key: "name", label: "Name", render: (r) => <span className="font-black">{r.name || "Nora Atlas"}</span> },
        { key: "user", label: "Login", render: (r) => r.user?.email || "-" },
        { key: "speciality", label: "Speciality" },
        { key: "phone", label: "Phone" },
        {
          key: "salary",
          label: "Salary",
          render: (r) => (r.salary ? formatCurrency(r.salary) : "-"),
        },
      ]}
    />
  );
}
