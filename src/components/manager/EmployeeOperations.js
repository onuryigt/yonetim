import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const EmployeeOperations = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [hourPrice, setHourPrice] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const managerId = user.id; // Giriş yapan yöneticinin ID'si
        const response = await axios.get(`http://92.112.193.81:5018/get-employees?managerId=${managerId}`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Mevcut elemanları çekerken hata oluştu:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const managerId = user.id; // Giriş yapan yöneticinin ID'si
      const response = await axios.post('http://92.112.193.81:5018/employee-operations', {
        firstName,
        lastName,
        phone,
        role,
        hourPrice,
        managerId, // Manager ID'yi ekleyin
      });
      alert(response.data);
      setFirstName('');
      setLastName('');
      setPhone('');
      setRole('');
      setHourPrice('');
      // Yeni eklenen elemanı da listeye ekleyelim
      setEmployees([...employees, { firstName, lastName, phone, role, hourPrice, manager_id: managerId }]);
    } catch (error) {
      console.error('Eleman ekleme başarısız', error);
      alert('Eleman ekleme başarısız');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Eleman Ekle
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="first-name"
              name="first-name"
              label="İsim"
              fullWidth
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="last-name"
              name="last-name"
              label="Soyisim"
              fullWidth
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="phone"
              name="phone"
              label="Telefon"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="role"
              name="role"
              label="Görev"
              fullWidth
              variant="outlined"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />  
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="hour-price"
                name="hour-price"
                label="Saatlik Ücret"
                fullWidth
                variant="outlined"
                value={hourPrice}
                onChange={(e) => setHourPrice(e.target.value)}
              />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Eleman Ekle
            </Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h5" gutterBottom>
        Mevcut Elemanlar
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>Soyisim</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Görev</TableCell>
<<<<<<< HEAD
              <TableCell>Saatlik Ücret</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.first_name}</TableCell>
                <TableCell>{employee.last_name}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.role}</TableCell>
<<<<<<< HEAD
                <TableCell>{employee.hour_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeOperations;