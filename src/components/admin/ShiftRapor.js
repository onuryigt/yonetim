import React, { useState, useEffect } from 'react';
import axios from 'axios';
<<<<<<< HEAD
 
=======
import DashboardSidebar from './DashboardSidebar';
>>>>>>> 7c6f6c8d43779df8e8dbf0480c87948c882aea2f
import './ShiftRapor.css';

const ShiftRapor = () => {
  const [businesses, setBusinesses] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
<<<<<<< HEAD
=======
  const [weekDetails, setWeekDetails] = useState([]);
>>>>>>> 7c6f6c8d43779df8e8dbf0480c87948c882aea2f

  const daysInTurkish = {
    monday: 'Pazartesi',
    tuesday: 'Salı',
    wednesday: 'Çarşamba',
    thursday: 'Perşembe',
    friday: 'Cuma',
    saturday: 'Cumartesi',
    sunday: 'Pazar',
  };

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

  const handleFetchShifts = async () => {
    if (!selectedBusiness) {
      alert('Please select a business.');
      return;
    }

    try {
      const response = await axios.get('http://92.112.193.81:5018/api/shifts', {
        params: {
          managerId: selectedBusiness,
          week: selectedWeek,
        },
      });
      setShifts(response.data.data);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  const handleWeekClick = (week) => {
    setSelectedWeek(week);
    handleFetchShifts();
  };

  const handleCellChange = (e, shiftId, field) => {
    const newShifts = shifts.map((shift) => {
      if (shift.id === shiftId) {
        return { ...shift, [field]: e.target.textContent };
      }
      return shift;
    });
    setShifts(newShifts);
  };

  const handleSave = async () => {
    try {
      await axios.put('http://92.112.193.81:5018/api/updateShifts', { shifts });
      alert('Veriler başarıyla kaydedildi!');
    } catch (error) {
      console.error('Veriler kaydedilirken hata oluştu:', error);
      alert('Veriler kaydedilirken hata oluştu.');
    }
  };

<<<<<<< HEAD
  // Benzersiz çalışanları al
  const uniqueEmployees = Array.from(new Set(shifts.map(shift => shift.employee_id)))
    .map(id => {
      return shifts.find(shift => shift.employee_id === id);
    });

  return (
    <div className="shift-rapor-container">
=======
  return (
    <div className="shift-rapor-container">
      <DashboardSidebar />
>>>>>>> 7c6f6c8d43779df8e8dbf0480c87948c882aea2f
      <div className="shift-rapor-content">
        <h1>Shift Raporu</h1>
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
          <button onClick={handleFetchShifts}>Filtrele</button>
        </div>
        <div className="weeks-section">
          <h2>Haftalar</h2>
          <ul>
            {shifts.length > 0 &&
              [...new Set(shifts.map((shift) => shift.shift_time))].map((week) => (
                <li key={week}>
                  <button onClick={() => handleWeekClick(week)}>{week}</button>
                </li>
              ))}
          </ul>
        </div>
        <div className="week-details-section">
          <h2>Hafta: {selectedWeek}</h2>
          <table className="shifts-table">
            <thead>
              <tr>
                <th>Çalışan Adı</th>
                {Object.values(daysInTurkish).map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
              {uniqueEmployees.length > 0 &&
                uniqueEmployees.map((employee) => (
                  <tr key={employee.employee_id}>
                    <td>{employee.employee_name}</td>
=======
              {shifts.length > 0 &&
                businesses.map((business) => (
                  <tr key={business.id}>
                    <td>{business.employee_name}</td>
>>>>>>> 7c6f6c8d43779df8e8dbf0480c87948c882aea2f
                    {Object.keys(daysInTurkish).map((day) => (
                      <td key={day}>
                        {shifts
                          .filter(
                            (shift) =>
                              shift.shift_time === selectedWeek &&
                              shift.day === day &&
<<<<<<< HEAD
                              shift.employee_id === employee.employee_id
=======
                              shift.employee_id === business.employee_id
>>>>>>> 7c6f6c8d43779df8e8dbf0480c87948c882aea2f
                          )
                          .map((shift) => (
                            <div
                              key={shift.id}
                              contentEditable
                              onBlur={(e) => handleCellChange(e, shift.id, 'shift')}
                            >
                              {shift.shift}
                            </div>
                          ))}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <button onClick={handleSave}>Kaydet</button>
      </div>
    </div>
  );
};

export default ShiftRapor;