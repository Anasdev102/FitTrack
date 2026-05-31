import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import MemberLayout from '../components/layout/MemberLayout';
import CoachLayout from '../components/layout/CoachLayout';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Pricing from '../pages/public/Pricing';
import Contact from '../pages/public/Contact';
import CoachesPublic from '../pages/public/Coaches';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/admin/Dashboard';
import Members from '../pages/admin/Members';
import Subscriptions from '../pages/admin/Subscriptions';
import Payments from '../pages/admin/Payments';
import Coaches from '../pages/admin/Coaches';
import CoachAssignments from '../pages/admin/CoachAssignments';
import CoachSchedules from '../pages/admin/CoachSchedules';
import Attendance from '../pages/admin/Attendance';
import AiReminder from '../pages/admin/AiReminder';
import MemberDashboard from '../pages/member/MemberDashboard';
import MySubscription from '../pages/member/MySubscription';
import MyPayments from '../pages/member/MyPayments';
import MyAttendance from '../pages/member/MyAttendance';
import Profile from '../pages/member/Profile';
import CoachDashboard from '../pages/coach/CoachDashboard';
import AssignedMembers from '../pages/coach/AssignedMembers';
import MemberDetails from '../pages/coach/MemberDetails';
import CoachSchedule from '../pages/coach/CoachSchedule';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/coaches" element={<CoachesPublic />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute role="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="payments" element={<Payments />} />
              <Route path="coaches" element={<Coaches />} />
              <Route path="coach-assignments" element={<CoachAssignments />} />
              <Route path="coach-schedules" element={<CoachSchedules />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="ai-reminder" element={<AiReminder />} />
            </Route>
          </Route>
          <Route element={<RoleRoute role="member" />}>
            <Route path="/member" element={<MemberLayout />}>
              <Route index element={<MemberDashboard />} />
              <Route path="subscription" element={<MySubscription />} />
              <Route path="payments" element={<MyPayments />} />
              <Route path="attendance" element={<MyAttendance />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          <Route element={<RoleRoute role="coach" />}>
            <Route path="/coach" element={<CoachLayout />}>
              <Route index element={<CoachDashboard />} />
              <Route path="dashboard" element={<CoachDashboard />} />
              <Route path="members" element={<AssignedMembers />} />
              <Route path="members/:id" element={<MemberDetails />} />
              <Route path="schedule" element={<CoachSchedule />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
