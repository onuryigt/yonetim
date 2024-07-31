import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Grid } from '@mui/material';
import axios from 'axios';

const CreateInvoice = () => {
  const [invoiceDetails, setInvoiceDetails] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://92.112.193.81:5018/create-invoice', {
        invoiceDetails,
      });
      alert(response.data);
    } catch (error) {
      console.error('Fatura oluşturma işlemi başarısız:', error);
      alert('Fatura oluşturma işlemi başarısız');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Fatura Oluştur
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="invoice-details"
              name="invoice-details"
              label="Fatura Detayları"
              fullWidth
              variant="outlined"
              value={invoiceDetails}
              onChange={(e) => setInvoiceDetails(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Oluştur
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateInvoice;