import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Grid } from '@mui/material';
import axios from 'axios';

const InvoiceEntry = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://92.112.193.81:5018/invoice-entry', {
        invoiceNumber,
        amount,
        date,
      });
      alert(response.data);
    } catch (error) {
      console.error('Fatura girişi ekleme işlemi başarısız:', error);
      alert('Fatura girişi ekleme işlemi başarısız');
    }
  };

 

 return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Fatura Girişi
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="invoice-number"
              name="invoice-number"
              label="Fatura Numarası"
              fullWidth
              variant="outlined"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="amount"
              name="amount"
              label="Tutar"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="date"
              name="date"
              label="Tarih"
              fullWidth
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Ekle
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default InvoiceEntry;