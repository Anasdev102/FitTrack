import React from 'react';
import { useEffect, useMemo, useState } from "react";
import ResourcePage from "./ResourcePage";
import { coachesApi } from "../../api/coachesApi";
import {
  createCoachSchedule,
  deleteCoachSchedule,
  fetchCoachSchedules,
  updateCoachSchedule,
} from "../../store/slices/coachSchedulesSlice";
import Badge from "../../components/common/Badge";

export default function CoachSchedules() {
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    coachesApi.list().then((response) => setCoaches(response.data.data || [])).catch(() => setCoaches([]));
  }, []);

  const fields = useMemo(() => [
    {
      name: "coach_id",
      label: "Coach",
      type: "select",
      options: [
        { value: "", label: "Select coach" },
        ...coaches.map((coach) => ({ value: coach.id, label: coach.name })),
      ],
    },
    { name: "title", label: "Title" },
    { name: "schedule_date", label: "Date", type: "date" },
    { name: "start_time", label: "Start time", type: "time" },
    { name: "end_time", label: "End time", type: "time" },
    { name: "location", label: "Location" },
    {
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: "scheduled",
      options: [
        { value: "scheduled", label: "Scheduled" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    { name: "description", label: "Description", type: "textarea" },
  ], [coaches]);

  return (
    <ResourcePage
      title="Coach Schedules"
      actionLabel="Add Schedule"
      slice="coachSchedules"
      fetchAction={fetchCoachSchedules}
      createAction={createCoachSchedule}
      updateAction={updateCoachSchedule}
      deleteAction={deleteCoachSchedule}
      fields={fields}
      columns={[
        { key: "coach", label: "Coach", render: (row) => row.coach?.name || "-" },
        { key: "title", label: "Title", render: (row) => <span className="font-black">{row.title}</span> },
        { key: "schedule_date", label: "Date" },
        { key: "start_time", label: "Start" },
        { key: "end_time", label: "End", render: (row) => row.end_time || "-" },
        { key: "location", label: "Location", render: (row) => row.location || "-" },
        { key: "status", label: "Status", render: (row) => <Badge tone={row.status === "completed" ? "green" : row.status === "cancelled" ? "red" : "orange"}>{row.status}</Badge> },
      ]}
    />
  );
}
