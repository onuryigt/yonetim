import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

const Attendance = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [hoursWorked, setHoursWorked] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const managerId = user.id;
        const response = await axios.get(`http://92.112.193.81:5018/get-employees?managerId=${managerId}`);
        setEmployeeList(response.data);
      } catch (error) {
        console.error('Çalışanlar alınırken hata oluştu:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const managerId = user.id;
      await axios.post('http://92.112.193.81:5018/add-attendance', {
        employee_id: selectedEmployee,
        date,
        hours_worked: hoursWorked,
        manager_id: managerId
      });
      alert('Puantaj başarıyla eklendi');
    } catch (error) {
      console.error('Puantaj eklenirken hata oluştu:', error);
      alert('Puantaj eklenirken hata oluştu');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Puantaj Ekle
      </Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <RadioGroup
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          sx={{ marginBottom: 2 }}
        >
          {employeeList.map((employee) => (
            <FormControlLabel
              key={employee.id}
              value={employee.id}
              control={<Radio />}
              label={`${employee.first_name} ${employee.last_name}`}
            />
          ))}
        </RadioGroup>
        <TextField
          fullWidth
          type="date"
          label="Tarih"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Çalışılan Saat"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          EKLE
        </Button>
      </Box>
    </Container>
  );
};

export default Attendance;