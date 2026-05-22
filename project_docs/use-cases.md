# Use Cases

## Use Case 1: Register Member

Actor: Guest

Flow:

1. Guest opens register page
2. Guest fills registration form
3. Guest submits form
4. System validates data
5. System creates member account
6. Member can login

## Use Case 2: Login

Actor: Admin or Member

Flow:

1. User opens login page
2. User enters email and password
3. System validates credentials
4. System generates auth token
5. User is redirected to dashboard based on role

## Use Case 3: Manage Members

Actor: Admin

Flow:

1. Admin opens members page
2. Admin views members list
3. Admin can create member
4. Admin can update member
5. Admin can delete member
6. Admin can search and filter members

## Use Case 4: Create Subscription

Actor: Admin

Flow:

1. Admin opens subscriptions page
2. Admin selects member
3. Admin selects subscription type
4. Admin enters price and dates
5. System creates subscription

## Use Case 5: Renew Subscription

Actor: Admin

Flow:

1. Admin selects expired subscription
2. Admin clicks renew
3. Admin enters new dates
4. System creates new active subscription

## Use Case 6: Manage Payments

Actor: Admin

Flow:

1. Admin opens payments page
2. Admin creates payment
3. Admin selects payment method
4. Admin selects payment status
5. System saves payment

## Use Case 7: Manage Coaches

Actor: Admin

Flow:

1. Admin opens coaches page
2. Admin creates coach
3. Admin edits coach
4. Admin deletes coach

## Use Case 8: Mark Attendance

Actor: Admin

Flow:

1. Admin opens attendance page
2. Admin searches member
3. Admin clicks mark as present
4. System saves attendance

## Use Case 9: Generate AI Reminder

Actor: Admin

Flow:

1. Admin opens AI Reminder page
2. Admin selects member
3. Admin selects language
4. System generates reminder message
5. Admin copies generated message

## Use Case 10: View Member Dashboard

Actor: Member

Flow:

1. Member logs in
2. Member views subscription status
3. Member views payment history
4. Member views attendance history
5. Member updates profile