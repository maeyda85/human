import './globals.css';

export const metadata = {
  title: 'HR Dashboard',
  description: 'Departments, Employees, Attendance, Leave Requests',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <a href="/">Home</a>
          <a href="/departments">Departments</a>
          <a href="/employees">Employees</a>
          <a href="/attendance">Attendance</a>
          <a href="/leave-requests">Leave Requests</a>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
