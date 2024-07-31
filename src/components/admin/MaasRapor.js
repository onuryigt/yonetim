import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardSidebar from './DashboardSidebar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MaasRapor.css';

const MaasRapor = () => {
  const [businesses, setBusinesses] = useState([]);
  const [salaryDetails, setSalaryDetails] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const months = [
    { value: '01', label: 'Ocak' },
    { value: '02', label: 'Şubat' },
    { value: '03', label: 'Mart' },
    { value: '04', label: 'Nisan' },
    { value: '05', label: 'Mayıs' },
    { value: '06', label: 'Haziran' },
    { value: '07', label: 'Temmuz' },
    { value: '08', label: 'Ağustos' },
    { value: '09', label: 'Eylül' },
    { value: '10', label: 'Ekim' },
    { value: '11', label: 'Kasım' },
    { value: '12', label: 'Aralık' },
  ];

  const years = [
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
  ];

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('http://92.112.193.81:5018/api/managers');
        setBusinesses(response.data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusiness && selectedMonth && selectedYear) {
      const fetchSalaryDetails = async () => {
        try {
          const response = await axios.get('http://92.112.193.81:5018/api/get-salary-details', {
            params: { managerId: selectedBusiness, month: selectedMonth, year: selectedYear }
          });
          setSalaryDetails(response.data);
        } catch (error) {
          console.error('Error fetching salary details:', error);
        }
      };

      fetchSalaryDetails();
    }
  }, [selectedBusiness, selectedMonth, selectedYear]);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const calculateSalary = (hours, rate) => {
    return hours * rate;
  };

  return (
    <div className="maas-rapor-container">
      <DashboardSidebar />
      <div className="maas-rapor-content">
        <h1>Maaş Raporu</h1>
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
          <label>Ay Seçin</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Ay Seçin</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <label>Yıl Seçin</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Yıl Seçin</option>
            {years.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>
        <div className="salary-details">
          {salaryDetails.length > 0 && (
            <table className="salary-table">
              <thead>
                <tr>
                  <th>Çalışan Adı</th>
                  <th>Toplam Çalışma Saati</th>
                  <th>Maaş</th>
                </tr>
              </thead>
              <tbody>
                {salaryDetails.map((employee) => (
                  <tr key={employee.employee_id} onClick={() => handleEmployeeClick(employee)}>
                    <td>{employee.first_name + ' ' + employee.last_name}</td>
                    <td>{employee.total_hours}</td>
                    <td>{calculateSalary(employee.total_hours, employee.hour_price).toFixed(2) || 0} TL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Modal
          show={isModalOpen}
          onHide={closeModal}
          aria-labelledby="employee-details-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="employee-details-modal">Çalışan Detayları</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEmployee && (
              <div className="employee-details">
                <h2>{selectedEmployee.first_name + ' ' + selectedEmployee.last_name} Günlük Çalışma Saatleri</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Çalışma Saati</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEmployee.daily_hours && JSON.parse(selectedEmployee.daily_hours).map((day, index) => (
                      <tr key={index}>
                        <td>{new Date(day.date).toLocaleDateString()}</td>
                        <td>{day.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Kapat
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default MaasRapor;