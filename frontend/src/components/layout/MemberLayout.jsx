import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardShell from './DashboardShell';

export default function MemberLayout() {
  const { user } = useSelector((state) => state.auth);
  const memberName = user?.name || readSavedUser()?.name || 'Member';

  return (
    <DashboardShell role="member" kicker="Member area" title="Member Club" userName={memberName}>
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
