export default function Home() {
  return (
    <div>
      <h1>HR Dashboard</h1>
      <p>
        Work through this in order: add a <strong>Department</strong> first,
        then an <strong>Employee</strong> (needs a department), then
        <strong> Attendance</strong> and <strong>Leave Requests</strong> (both
        need an employee).
      </p>
      <ol>
        <li><a href="/departments">1. Departments</a></li>
        <li><a href="/employees">2. Employees</a></li>
        <li><a href="/attendance">3. Attendance</a></li>
        <li><a href="/leave-requests">4. Leave Requests</a></li>
      </ol>
    </div>
  );
}
