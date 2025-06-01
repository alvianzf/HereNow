import AdminLayout from '../../components/layout/AdminLayout';
import EmployeeListTable from '../../components/admin/EmployeeListTable';

export default function EmployeeList() {
  return (
    <AdminLayout title="Employee Management">
      <EmployeeListTable />
    </AdminLayout>
  );
}