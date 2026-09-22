# HR Dashboard (Next.js 16 + Supabase)

A small app for the department / employees / attendance / leave_request
schema. Each section has a form to add a record and a table showing
existing records, joined with related data (e.g. employees show their
department name).

## 1. Set up Supabase

1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run your `hr.sql` file to create and seed the
   tables (department, employees, attendance, leave_request).
3. Go to **Project Settings -> API** and copy the **Project URL** and the
   **anon public** key.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste in your Supabase URL and anon key.

## 3. Install dependencies

```bash
npm install
```

This installs Next.js 16.2 and React 19.2 (the current stable releases as of
this writing). If you're adding this into an existing older project instead,
upgrade in place first:

```bash
npx next upgrade
# or, on Next.js < 16.1 which lacks the upgrade command:
npx @next/codemod@canary upgrade latest
```

## 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

## 5. Suggested order of use

1. **Departments** (`/departments`) — add departments first, since
   employees reference a department.
2. **Employees** (`/employees`) — add employees, picking a department
   from the dropdown.
3. **Attendance** (`/attendance`) — add attendance records for an
   employee.
4. **Leave Requests** (`/leave-requests`) — add leave requests for an
   employee.

## Notes

- IDs (department_id, employee_id, attendance_id, leave_id) are entered
  manually in the forms because the schema uses plain INT primary keys,
  not auto-increment. If you want auto-generated IDs instead, change
  those columns in Supabase to `GENERATED ALWAYS AS IDENTITY` and remove
  the corresponding fields from each form / server action.
- Row Level Security (RLS) is not configured here. For local testing
  this is fine. Before deploying, either disable public access to these
  tables or add RLS policies (see Supabase docs), since the anon key
  used here is exposed to the browser.
- Deleting/updating records (e.g. approving a leave request) isn't
  wired into the UI yet — happy to add that next if useful.
