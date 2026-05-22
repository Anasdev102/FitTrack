# Database Schema

## users

Stores admins and members.

Fields:

- id
- name
- email
- phone
- password
- role enum: admin, member
- image nullable
- created_at
- updated_at

Relationships:

- user has many subscriptions
- user has many payments
- user has many attendances

## subscriptions

Stores member subscriptions.

Fields:

- id
- user_id foreign key
- type enum: monthly, quarterly, yearly
- price decimal
- start_date date
- end_date date
- status enum: active, expired
- created_at
- updated_at

Relationships:

- subscription belongs to user
- subscription has many payments

## payments

Stores member payments.

Fields:

- id
- user_id foreign key
- subscription_id foreign key nullable
- amount decimal
- method enum: cash, card, bank_transfer
- status enum: paid, unpaid
- payment_date date
- created_at
- updated_at

Relationships:

- payment belongs to user
- payment belongs to subscription nullable

## coaches

Stores gym coaches.

Fields:

- id
- name
- phone
- speciality
- salary decimal nullable
- image nullable
- created_at
- updated_at

## attendances

Stores member attendance.

Fields:

- id
- user_id foreign key
- date date
- time time
- created_at
- updated_at

Relationships:

- attendance belongs to user