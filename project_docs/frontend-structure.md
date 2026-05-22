# Frontend Structure

The frontend uses:

- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Redux Toolkit
- React Redux

## Folder Structure

```txt
src/
  api/
    axios.js
    authApi.js
    membersApi.js
    subscriptionsApi.js
    paymentsApi.js
    coachesApi.js
    attendanceApi.js
    dashboardApi.js
    aiApi.js

  store/
    store.js

    slices/
      authSlice.js
      dashboardSlice.js
      membersSlice.js
      subscriptionsSlice.js
      paymentsSlice.js
      coachesSlice.js
      attendanceSlice.js
      aiSlice.js

  components/
    common/
      Button.jsx
      Input.jsx
      Modal.jsx
      Table.jsx
      Badge.jsx
      StatCard.jsx
      Loading.jsx
      EmptyState.jsx

    layout/
      PublicLayout.jsx
      AdminLayout.jsx
      MemberLayout.jsx
      Navbar.jsx
      Sidebar.jsx

  pages/
    public/
      Home.jsx
      About.jsx
      Pricing.jsx
      Contact.jsx

    auth/
      Login.jsx
      Register.jsx

    admin/
      Dashboard.jsx
      Members.jsx
      Subscriptions.jsx
      Payments.jsx
      Coaches.jsx
      Attendance.jsx
      AiReminder.jsx
      Settings.jsx

    member/
      MemberDashboard.jsx
      MySubscription.jsx
      MyPayments.jsx
      MyAttendance.jsx
      Profile.jsx

  router/
    AppRouter.jsx
    ProtectedRoute.jsx
    RoleRoute.jsx

  utils/
    formatDate.js
    formatCurrency.js

  App.jsx
  main.jsx