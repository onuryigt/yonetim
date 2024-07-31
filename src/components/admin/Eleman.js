import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardSidebar from './DashboardSidebar';
import './Elemanlar.css';

const Elemanlar = () => {
  const [businesses, setBusinesses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    role: '',
    hour_price: ''
  });

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://92.112.193.8:5018/api/managers');
        setBusinesses(response.data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  const handleFetchEmployees = async () => {
    if (!selectedBusiness) {
      alert('Please select a business.');
      return;
    }

    try {
      const response = await axios.get('http://92.112.193.8:5018/get-employees', {
        params: {
          managerId: selectedBusiness,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee.id);
    setEmployeeForm({
      first_name: employee.first_name,
      last_name: employee.last_name,
      phone: employee.phone,
      role: employee.role,
      hour_price: employee.hour_price
    });
  };

  const handleSaveEmployee = async () => {
    try {
      await axios.put(`http://92.112.193.8:5018/api/update-employee/${editingEmployee}`, employeeForm);
      setEditingEmployee(null);
      handleFetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  return (
    <div className="elemanlar-container">
      <DashboardSidebar />
      <div className="elemanlar-content">
        <h1>Elemanlar</h1>
        <div className="filter-section">
          <label>İşletme Seçin</label>
          <select
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
          >
            <option value="">İşletme Seçin</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.business_name}
              </option>
            ))}
          </select>
          <button onClick={handleFetchEmployees}>Filtrele</button>
        </div>
        <table className="employees-table">
          <thead>
            <tr>
              <th>Adı</th>
              <th>Soyadı</th>
              <th>Telefon</th>
              <th>Rol</th>
              <th>Saatlik Ücret</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.first_name}</td>
                <td>{employee.last_name}</td>
                <td>{employee.phone}</td>
                <td>{employee.role}</td>
                <td>{employee.hour_price}</td>
                <td>
                  <button onClick={() => handleEditEmployee(employee)}>Düzenle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editingEmployee && (
          <div className="edit-form">
            <h2>Eleman Düzenle</h2>
            <label>Adı</label>
            <input
              type="text"
              value={employeeForm.first_name}
              onChange={(e) => setEmployeeForm({ ...employeeForm, first_name: e.target.value })}
            />
            <label>Soyadı</label>
            <input
              type="text"
              value={employeeForm.last_name}
              onChange={(e) => setEmployeeForm({ ...employeeForm, last_name: e.target.value })}
            />
            <label>Telefon</label>
            <input
              type="text"
              value={employeeForm.phone}
              onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
            />
            <label>Rol</label>
            <input
              type="text"
              value={employeeForm.role}
              onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
            />
            <label>Saatlik Ücret</label>
            <input
              type="text"
              value={employeeForm.hour_price}
              onChange={(e) => setEmployeeForm({ ...employeeForm, hour_price: e.target.value })}
            />
            <button onClick={handleSaveEmployee}>Kaydet</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Elemanlar;