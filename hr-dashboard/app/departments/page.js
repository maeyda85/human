import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

async function addDepartment(formData) {
  'use server';
  const department_id = Number(formData.get('department_id'));
  const department_name = formData.get('department_name');
  const location = formData.get('location');

  const { error } = await supabase
    .from('department')
    .insert({ department_id, department_name, location });

  if (error) throw new Error(error.message);
  revalidatePath('/departments');
}

export default async function DepartmentsPage() {
  const { data: departments, error } = await supabase
    .from('department')
    .select('*')
    .order('department_id');

  return (
    <div>
      <h1>Departments</h1>
      

      <form action={addDepartment}>
        <label>Department ID</label>
        <input type="number" name="department_id" required />

        <label>Department Name</label>
        <input type="text" name="department_name" required />

        <label>Location</label>
        <input type="text" name="location" />

        <button type="submit">Add Department</button>
      </form>

      {error && <p className="error">Error: {error.message}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {departments?.map((d) => (
            <tr key={d.department_id}>
              <td>{d.department_id}</td>
              <td>{d.department_name}</td>
              <td>{   d.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
