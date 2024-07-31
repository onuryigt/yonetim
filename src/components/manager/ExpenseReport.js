import React, { useState } from 'react';
import { Container, Typography, Grid, Paper, Button, TextField } from '@mui/material';
import axios from 'axios';

const ExpenseReport = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('expenseFile', file);

    try {
      const response = await axios.post('http://92.112.193.8:5018/expense-report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data);
      setFile(null);
    } catch (error) {
      console.error('Dosya yükleme hatası', error);
      alert('Dosya yükleme hatası');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Aylık Harcama Raporu Yükle
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Dosya Yükle</Typography>
            <TextField
              type="file"
              onChange={handleFileChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFileUpload}
              style={{ marginTop: '16px' }}
            >
              Yükle
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExpenseReport;