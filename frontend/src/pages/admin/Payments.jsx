import Badge from "../../components/common/Badge";
import ResourcePage from "./ResourcePage";
import { createPayment, deletePayment, fetchPayments, updatePayment } from "../../store/slices/paymentsSlice";
import { formatCurrency } from "../../utils/formatCurrency";
export default function Payments() {
  return (
    <ResourcePage
      title="Payments"
      actionLabel="Add Payment"
      slice="payments"
      fetchAction={fetchPayments}
      createAction={createPayment}
      updateAction={updatePayment}
      deleteAction={deletePayment}
      fields={[
        { name: "user_id", label: "Member ID", type: "number" },
        { name: "subscription_id", label: "Subscription ID", type: "number" },
        { name: "amount", label: "Amount", type: "number", defaultValue: "49" },
        { name: "method", label: "Method", type: "select", defaultValue: "cash", options: [
          { value: "cash", label: "Cash" },
        ] },
        { name: "status", label: "Status", type: "select", defaultValue: "paid", options: [
          { value: "paid", label: "Paid" },
        ] },
        { name: "payment_date", label: "Payment date", type: "date", defaultValue: today() },
      ]}
      columns={[
        { key: "member", label: "Member", render: (r) => r.member?.name || "Michael Johnson" },
        {
          key: "amount",
          label: "Amount",
          render: (r) => formatCurrency(r.amount || 120),
        },
        { key: "method", label: "Method", render: (r) => <span className="font-bold">{r.method || "cash"}</span> },
        {
          key: "status",
          label: "Status",
          render: (r) => (
            <Badge tone={r.status === "paid" ? "green" : "orange"}>
              {r.status || "Paid"}
            </Badge>
          ),
        },
        { key: "payment_date", label: "Date" },
      ]}
    />
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
