import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import DashboardSidebar from './DashboardSidebar'; // DashboardSidebar bileşenini ekleyelim

const AddManager = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    business_name: ''
  });
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await axios.get('http://92.112.193.81:5018/managers');
      setManagers(response.data.managers);
    } catch (error) {
      console.error('Müdürleri getirirken hata:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://92.112.193.81:5018/add-manager', formData);
      alert(response.data.message);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        business_name: ''
      });
      fetchManagers(); // Yeni müdür eklendikten sonra listeyi güncelle
    } catch (error) {
      console.error('Müdür ekleme hatası:', error);
      alert('Müdür eklerken bir hata oluştu');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <DashboardSidebar />
      <Container maxWidth="md" style={{ marginLeft: '240px' }}>
        <Typography variant="h4" gutterBottom>
          Müdür Ekle
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="first_name"
                name="first_name"
                label="İsim"
                fullWidth
                variant="outlined"
                value={formData.first_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="last_name"
                name="last_name"
                label="Soyisim"
                fullWidth
                variant="outlined"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="email"
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="password"
                name="password"
                label="Şifre"
                type="password"
                fullWidth
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="business_name"
                name="business_name"
                label="İşletme Adı"
                fullWidth
                variant="outlined"
                value={formData.business_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Müdür Ekle
              </Button>
            </Grid>
          </Grid>
        </form>
        <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
          Mevcut Müdürler
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>İsim</TableCell>
                <TableCell>Soyisim</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>İşletme Adı</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {managers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell>{manager.id}</TableCell>
                  <TableCell>{manager.first_name}</TableCell>
                  <TableCell>{manager.last_name}</TableCell>
                  <TableCell>{manager.email}</TableCell>
                  <TableCell>{manager.business_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default AddManager;