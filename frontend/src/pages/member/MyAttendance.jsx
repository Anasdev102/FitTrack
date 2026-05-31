import React from 'react';
import { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import { memberApi } from "../../api/memberApi";

export default function MyAttendance() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    memberApi.attendances()
      .then((response) => setRows(response.data.data || []))
      .catch((err) => setError(err.response?.data?.message || err.message || "Could not load attendance."));
  }, []);

  return (
    <div className="page-enter grid gap-6">
      <h1 className="text-2xl font-black">My Attendance</h1>
      {error && <div className="rounded border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      <Table
        columns={[
          { key: "date", label: "Date" },
          { key: "time", label: "Check In" },
          { key: "status", label: "Status", render: () => <Badge tone="green">Present</Badge> },
        ]}
        rows={rows}
      />
    </div>
  );
}
