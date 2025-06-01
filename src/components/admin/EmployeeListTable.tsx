import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '../../services/userService';
import { User } from '../../types/user';
import { Search, ChevronRight, Users } from 'lucide-react';

export default function EmployeeListTable() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<User[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = employees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(term) ||
        employee.lastName.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term) ||
        employee.position.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term)
    );

    setFilteredEmployees(filtered);
  };

  const handleViewEmployee = (id: string) => {
    navigate(`/admin/employees/${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Employees</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'} total
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employees..."
              className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Position
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {employee.profileImage ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={employee.profileImage}
                            alt={`${employee.firstName} ${employee.lastName}`}
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {employee.department}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {employee.position}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {employee.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewEmployee(employee.id)}
                      className="text-primary hover:text-primary/80"
                    >
                      <div className="flex items-center">
                        <span>View</span>
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}