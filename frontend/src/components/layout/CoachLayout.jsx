import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardShell from './DashboardShell';

export default function CoachLayout() {
  const { user } = useSelector((state) => state.auth);
  const coachName = user?.name || readSavedUser()?.name || 'Coach';

  return (
    <DashboardShell role="coach" kicker="Coach area" title="Coach Workspace" userName={coachName}>
      <Outlet />
    </DashboardShell>
  );
}

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('fitmanager_user'));
  } catch {
    return null;
  }
}
