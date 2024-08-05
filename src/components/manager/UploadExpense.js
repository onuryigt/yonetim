import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Grid } from '@mui/material';
import axios from 'axios';

const UploadExpense = () => {
  const [expenseFile, setExpenseFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('expenseFile', expenseFile);

    try {
      const response = await axios.post('http://92.112.193.81:5018/expense-report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data);
    } catch (error) {
      console.error('Harcama dosyası yüklenirken hata oluştu:', error);
      alert('Harcama dosyası yüklenirken hata oluştu');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Aylık Harcama Exceli Yükle
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <input
              required
              type="file"
              id="expense-file"
              name="expense-file"
              onChange={(e) => setExpenseFile(e.target.files[0])}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Yükle
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default UploadExpense;