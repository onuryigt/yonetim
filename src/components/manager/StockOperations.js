import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Grid } from '@mui/material';
import axios from 'axios';

const StockOperations = () => {
  const [stockFile, setStockFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('stockFile', stockFile);

    try {
      const response = await axios.post('http://92.112.193.8:5018/stock-report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data);
    } catch (error) {
      console.error('Stok dosyası yüklenirken hata oluştu:', error);
      alert('Stok dosyası yüklenirken hata oluştu');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Aylık Stok Sayım Exceli Yükle
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <input
              required
              type="file"
              id="stock-file"
              name="stock-file"
              onChange={(e) => setStockFile(e.target.files[0])}
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

export default StockOperations;