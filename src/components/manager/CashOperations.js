import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

const CashOperations = () => {
  const [formData, setFormData] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    posRevenue: '',
    ysRevenue: '',
    ysOnline: '',
    cashStart: '',
    cashEnd: '',
    pos1: '',
    pos2: '',
    pos3: '',
    ticket: '',
    multinet: '',
    sodexo: '',
    bank: '',
    expense: '',
    managerId: '' // Yeni eklenen alan
  });
  const [popupOpen, setPopupOpen] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [checkType, setCheckType] = useState('');
  const [managers, setManagers] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState(''); // Yeni eklenen state

  useEffect(() => {
    // Tüm müdürleri yükle
    const fetchManagers = async () => {
      try {
        const response = await axios.get('http://92.112.193.81:5018/managerss');
        setManagers(response.data);
      } catch (error) {
        console.error('Müdürler yüklenemedi', error);
      }
    };
    fetchManagers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleManagerChange = (e) => {
    setSelectedManagerId(e.target.value);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setCheckResult(null);
    setCheckType('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      date,
      posRevenue,
      ysRevenue,
      ysOnline,
      cashStart,
      cashEnd,
      pos1,
      pos2,
      pos3,
      ticket,
      multinet,
      sodexo,
      bank,
      expense
    } = formData;

    const checkResult = 
      (parseFloat(ysOnline || 0) + parseFloat(cashEnd || 0) + parseFloat(pos1 || 0) + parseFloat(pos2 || 0) + parseFloat(pos3 || 0) + parseFloat(ticket || 0) + parseFloat(multinet || 0) + parseFloat(sodexo || 0) + parseFloat(bank || 0) - parseFloat(expense || 0) - parseFloat(posRevenue || 0) - parseFloat(cashStart || 0)).toFixed(2);

    const checkType = checkResult < 0 ? 'EKSİ AÇIK' : 'ARTI AÇIK';

    setCheckResult(checkResult);
    setCheckType(checkType);
    setPopupOpen(true);
  };

  const handlePopupConfirm = async () => {
    const {
      date,
      posRevenue,
      ysRevenue,
      ysOnline,
      cashStart,
      cashEnd,
      pos1,
      pos2,
      pos3,
      ticket,
      multinet,
      sodexo,
      bank,
      expense
    } = formData;

    try {
      const response = await axios.post('http://92.112.193.81:5018/cash-operations', {
        ...formData,
        posRevenue: parseFloat(posRevenue || 0),
        ysRevenue: parseFloat(ysRevenue || 0),
        ysOnline: parseFloat(ysOnline || 0),
        cashStart: parseFloat(cashStart || 0),
        cashEnd: parseFloat(cashEnd || 0),
        pos1: parseFloat(pos1 || 0),
        pos2: parseFloat(pos2 || 0),
        pos3: parseFloat(pos3 || 0),
        ticket: parseFloat(ticket || 0),
        multinet: parseFloat(multinet || 0),
        sodexo: parseFloat(sodexo || 0),
        bank: parseFloat(bank || 0),
        expense: parseFloat(expense || 0),
        checkResult,
        managerId: selectedManagerId // Yeni eklenen alan
      });
      alert(response.data);
      handlePopupClose();
    } catch (error) {
      console.error('Gün sonu işlemi başarısız', error);
      alert('Gün sonu işlemi başarısız');
      handlePopupClose();
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Gün Sonu Yap
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="manager-select-label">Müdür Seçin</InputLabel>
              <Select
                labelId="manager-select-label"
                id="manager-select"
                value={selectedManagerId}
                onChange={handleManagerChange}
              >
                {managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>
                    {manager.first_name} {manager.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="date"
              name="date"
              label="Tarih"
              fullWidth
              type="date"
              variant="outlined"
              value={formData.date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="posRevenue"
              name="posRevenue"
              label="POS Ciro"
              fullWidth
              variant="outlined"
              value={formData.posRevenue}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="ysRevenue"
              name="ysRevenue"
              label="YemekSepeti Ciro"
              fullWidth
              variant="outlined"
              value={formData.ysRevenue}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="ysOnline"
              name="ysOnline"
              label="YS Online"
              fullWidth
              variant="outlined"
              value={formData.ysOnline}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="cashStart"
              name="cashStart"
              label="Kasa Başlangıcı"
              fullWidth
              variant="outlined"
              value={formData.cashStart}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="cashEnd"
              name="cashEnd"
              label="Kasa Son"
              fullWidth
              variant="outlined"
              value={formData.cashEnd}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="pos1"
              name="pos1"
              label="POS1"
              fullWidth
              variant="outlined"
              value={formData.pos1}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="pos2"
              name="pos2"
              label="POS2"
              fullWidth
              variant="outlined"
              value={formData.pos2}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="pos3"
              name="pos3"
              label="POS3"
              fullWidth
              variant="outlined"
              value={formData.pos3}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="ticket"
              name="ticket"
              label="TİCKET"
              fullWidth
              variant="outlined"
              value={formData.ticket}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="multinet"
              name="multinet"
              label="MULTİNET"
              fullWidth
              variant="outlined"
              value={formData.multinet}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="sodexo"
              name="sodexo"
              label="SODEXO"
              fullWidth
              variant="outlined"
              value={formData.sodexo}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="bank"
              name="bank"
              label="BANKA"
              fullWidth
              variant="outlined"
              value={formData.bank}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="expense"
              name="expense"
              label="HARCAMA"
              fullWidth
              variant="outlined"
              value={formData.expense}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Gün Sonu Yap
            </Button>
          </Grid>
        </Grid>
      </form>
      <Dialog open={popupOpen} onClose={handlePopupClose}>
        <DialogTitle>Kontrol Sonucu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Sonuç: ${checkType}, Miktar: ${checkResult}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopupClose} color="secondary">
            İptal
          </Button>
          <Button onClick={handlePopupConfirm} color="primary">
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CashOperations;
            