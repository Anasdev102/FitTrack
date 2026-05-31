import { Outlet } from 'react-router-dom';
import DashboardShell from './DashboardShell';

export default function AdminLayout() {
  return (
    <DashboardShell role="admin" kicker="FitManager" title="Club Command" userName="Admin User">
      <Outlet />
    </DashboardShell>
  );
}
