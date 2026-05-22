# Functional Requirements

## Public Website

The public website should include:

- Home page
- About section
- Services section
- Subscription plans
- Coaches preview
- Contact section
- Login link
- Register link

## Authentication

The system must allow:

- Admin login
- Member registration
- Member login
- Logout
- Protected routes
- Role-based access

## Admin Features

Admin can:

- View dashboard statistics
- Manage members
- Manage subscriptions
- Manage payments
- Manage coaches
- Mark attendance
- Generate AI reminder messages
- View recent members
- View recent payments

## Member Features

Member can:

- Register from the platform
- Login
- View personal subscription
- View subscription status
- View payment history
- View attendance history
- Edit profile

## Members Management

Admin can:

- Create member
- Update member
- Delete member
- View members list
- Search by name or phone
- Filter by status active or expired
- View member profile

## Subscriptions Management

Admin can:

- Create subscription for member
- Renew subscription
- View active subscriptions
- View expired subscriptions
- Filter subscriptions by status

Subscription types:

- monthly
- quarterly
- yearly

## Payments Management

Admin can:

- Create payment
- View payment history
- Filter payments by method
- Filter payments by status

Payment methods:

- cash
- card
- bank_transfer

Payment status:

- paid
- unpaid

## Coaches Management

Admin can:

- Create coach
- Update coach
- Delete coach
- View coaches list

## Attendance Management

Admin can:

- Search member
- Mark member as present
- View attendance history
- View attendance today

## AI Reminder Generator

Admin can generate reminder messages for members whose subscriptions are close to expiration.

Input:

- member name
- subscription end date
- language

Output:

- professional reminder message