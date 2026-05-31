import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import membersReducer from './slices/membersSlice';
import subscriptionsReducer from './slices/subscriptionsSlice';
import paymentsReducer from './slices/paymentsSlice';
import coachesReducer from './slices/coachesSlice';
import attendanceReducer from './slices/attendanceSlice';
import aiReducer from './slices/aiSlice';
import coachDashboardReducer from './slices/coachDashboardSlice';
import coachMembersReducer from './slices/coachMembersSlice';
import coachNotesReducer from './slices/coachNotesSlice';
import trainingPlansReducer from './slices/trainingPlansSlice';
import coachSchedulesReducer from './slices/coachSchedulesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    members: membersReducer,
    subscriptions: subscriptionsReducer,
    payments: paymentsReducer,
    coaches: coachesReducer,
    attendance: attendanceReducer,
    ai: aiReducer,
    coachDashboard: coachDashboardReducer,
    coachMembers: coachMembersReducer,
    coachNotes: coachNotesReducer,
    trainingPlans: trainingPlansReducer,
    coachSchedules: coachSchedulesReducer,
  },
});
