# Business Rules

## Roles

- Admin can access all admin features.
- Member can only access member dashboard.
- Member cannot access admin pages.
- Guest can only access public pages, login, and register.

## Subscription Rules

- A subscription belongs to one member.
- A member can have many subscriptions.
- Only one subscription should be active at a time.
- Subscription status is active when end_date is today or in the future.
- Subscription status becomes expired when end_date is passed.
- Admin can renew subscription by creating a new subscription.

## Payment Rules

- A payment belongs to one member.
- A payment can be linked to a subscription.
- Payment can be paid or unpaid.
- Payment method can be cash, card, or bank_transfer.
- Online payment is not required in MVP.

## Attendance Rules

- Attendance belongs to one member.
- A member can be marked present only once per day.
- Only admin can mark attendance.
- Member can only view his own attendance history.

## AI Reminder Rules

- Only admin can generate AI reminder messages.
- AI reminder message should be professional and short.
- AI reminder can be generated in Arabic, French, or English.
- AI should not send messages automatically.
- The system only generates text; admin copies it manually.

## Security Rules

- Passwords must be hashed.
- API routes must be protected by Sanctum.
- Admin routes require admin role.
- Member routes require member role.
- Users can only access their own member data unless they are admin.