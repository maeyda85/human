import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

async function addLeaveRequest(formData) {
  'use server';
  const payload = {
    leave_id: Number(formData.get('leave_id')),
    employee_id: Number(formData.get('employee_id')),
    leave_type: formData.get('leave_type'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    status: formData.get('status') || 'Pending',
    reason: formData.get('reason'),
  };

  const { error } = await supabase.from('leave_request').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/leave-requests');
}

export default async function LeaveRequestsPage() {
  const { data: employees } = await supabase
    .from('employees')
    .select('employee_id, first_name, last_name')
    .order('employee_id');

  const { data: requests, error } = await supabase
    .from('leave_request')
    .select(`
      leave_id,
      leave_type,
      start_date,
      end_date,
      status,
      reason,
      employees ( first_name, last_name )
    `)
    .order('start_date', { ascending: false });

  return (
    <div>
      <h1>Leave Requests</h1>

      <form action={addLeaveRequest}>
        <label>Leave ID</label>
        <input type="number" name="leave_id" required />

        <label>Employee</label>
        <select name="employee_id" required>
          <option value="">Select employee</option>
          {employees?.map((e) => (
            <option key={e.employee_id} value={e.employee_id}>
              {e.first_name} {e.last_name}
            </option>
          ))}
        </select>

        <label>Leave Type</label>
        <input type="text" name="leave_type" placeholder="Sick Leave, Annual Leave..." />

        <label>Start Date</label>
        <input type="date" name="start_date" required />

        <label>End Date</label>
        <input type="date" name="end_date" required />

        <label>Status</label>
        <select name="status">
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <label>Reason</label>
        <input type="text" name="reason" />

        <button type="submit">Add Leave Request</button>
      </form>

      {error && <p className="error">Error: {error.message}</p>}

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {requests?.map((r) => (
            <tr key={r.leave_id}>
              <td>{r.employees?.first_name} {r.employees?.last_name}</td>
              <td>{r.leave_type}</td>
              <td>{r.start_date}</td>
              <td>{r.end_date}</td>
              <td>{r.status}</td>
              <td>{r.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
