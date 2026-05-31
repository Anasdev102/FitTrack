import { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import { memberApi } from "../../api/memberApi";
import { formatCurrency } from "../../utils/formatCurrency";

export default function MyPayments() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    memberApi.payments()
      .then((response) => setRows(response.data.data || []))
      .catch((err) => setError(err.response?.data?.message || err.message || "Could not load payments."));
  }, []);

  return (
    <div className="page-enter grid gap-6">
      <h1 className="text-2xl font-black">My Payments</h1>
      {error && <div className="rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      <Table
        columns={[
          { key: "payment_date", label: "Date" },
          { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
          { key: "method", label: "Method" },
          { key: "status", label: "Status", render: (row) => <Badge tone={row.status === "unpaid" ? "orange" : "green"}>{row.status}</Badge> },
        ]}
        rows={rows}
      />
    </div>
  );
}
