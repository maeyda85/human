import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

async function addEmployee(formData) {
  'use server';
  const payload = {
    employee_id: Number(formData.get('employee_id')),
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    department_id: Number(formData.get('department_id')),
    hire_date: formData.get('hire_date'),
    salary: Number(formData.get('salary')),
  };

  const { error } = await supabase.from('employees').insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath('/employees');
}

export default async function EmployeesPage() {
  const { data: departments } = await supabase
    .from('department')
    .select('department_id, department_name')
    .order('department_id');

  const { data: employees, error } = await supabase
    .from('employees')
    .select(`
      employee_id,
      first_name,
      last_name,
      email,
      hire_date,
      salary,
      department:department_id ( department_name )
    `)
    .order('employee_id');

  return (
    <div>
      <h1>Employees</h1>

      <form action={addEmployee}>
        <label>Employee ID</label>
        <input type="number" name="employee_id" required />

        <label>First Name</label>
        <input type="text" name="first_name" required />

        <label>Last Name</label>
        <input type="text" name="last_name" required />

        <label>Email</label>
        <input type="email" name="email" />

        <label>Department</label>
        <select name="department_id" required>
          <option value="">Select department</option>
          {departments?.map((d) => (
            <option key={d.department_id} value={d.department_id}>
              {d.department_name}
            </option>
          ))}
        </select>

        <label>Hire Date</label>
        <input type="date" name="hire_date" />

        <label>Salary</label>
        <input type="number" step="0.01" name="salary" />

        <button type="submit">Add Employee</button>
      </form>

      {error && <p className="error">Error: {error.message}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Hire Date</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((e) => (
            <tr key={e.employee_id}>
              <td>{e.employee_id}</td>
              <td>{e.first_name} {e.last_name}</td>
              <td>{e.department?.department_name}</td>
              <td>{e.hire_date}</td>
              <td>{e.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
