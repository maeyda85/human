import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

async function addAttendance(formData) {
  'use server';
  const payload = {
    attendance_id: Number(formData.get('attendance_id')),
    employee_id: Number(formData.get('employee_id')),
    attendance_date: formData.get('attendance_date'),
    status: formData.get('status'),
    check_in: formData.get('check_in') || null,
    check_out: formData.get('check_out') || null,
  };

  const { error } = await supabase.from('attendance').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/attendance');
}

export default async function AttendancePage() {
  const { data: employees } = await supabase
    .from('employees')
    .select('employee_id, first_name, last_name')
    .order('employee_id');

  const { data: records, error } = await supabase
    .from('attendance')
    .select(`
      attendance_id,
      attendance_date,
      status,
      check_in,
      check_out,
      employees ( first_name, last_name )
    `)
    .order('attendance_date', { ascending: false });

  return (
    <div>
      <h1>Attendance</h1>

      <form action={addAttendance}>
        <label>Attendance ID</label>
        <input type="number" name="attendance_id" required />

        <label>Employee</label>
        <select name="employee_id" required>
          <option value="">Select employee</option>
          {employees?.map((e) => (
            <option key={e.employee_id} value={e.employee_id}>
              {e.first_name} {e.last_name}
            </option>
          ))}
        </select>

        <label>Date</label>
        <input type="date" name="attendance_date" required />

        <label>Status</label>
        <select name="status" required>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
          <option value="Half Day">Half Day</option>
        </select>

        <label>Check In</label>
        <input type="time" name="check_in" />

        <label>Check Out</label>
        <input type="time" name="check_out" />

        <button type="submit">Add Attendance</button>
      </form>

      {error && <p className="error">Error: {error.message}</p>}

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>
        <tbody>
          {records?.map((r) => (
            <tr key={r.attendance_id}>
              <td>{r.attendance_date}</td>
              <td>{r.employees?.first_name} {r.employees?.last_name}</td>
              <td>{r.status}</td>
              <td>{r.check_in}</td>
              <td>{r.check_out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
