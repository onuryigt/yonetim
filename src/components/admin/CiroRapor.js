import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const CiroRapor = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [selectedMetric, setSelectedMetric] = useState('pos_revenue');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://92.112.193.81:5018/api/cash-operations');
        console.log('Fetched data:', response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    const fetchManagers = async () => {
      try {
        const response = await axios.get('http://92.112.193.81:5018/managers');
        if (response.data.success) {
          setManagers(response.data.managers);
        } else {
          console.error('Error fetching managers:', response.data.message);
        }
      } catch (error) {
        console.error('Network Error:', error);
      }
    };

    fetchData();
    fetchManagers();
  }, []);

  const handleDateChange = (e, type) => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const handleMetricChange = (e) => {
    setSelectedMetric(e.target.value);
  };

  const handleBusinessChange = (e) => {
    setSelectedBusiness(e.target.value);
  };

  const filterAndMapData = () => {
    if (!data || !Array.isArray(data)) return [];
  
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      const isWithinDateRange =
        (!startDate || itemDate >= new Date(startDate)) &&
        (!endDate || itemDate <= new Date(endDate));
      const isWithinBusiness =
        !selectedBusiness || item.manager_id === parseInt(selectedBusiness);
      return isWithinDateRange && isWithinBusiness;
    });
  
    const groupedData = filteredData.reduce((acc, item) => {
      const date = item.date.split('T')[0]; // Sadece tarihi alın
      if (!acc[date]) acc[date] = {};
      acc[date][item.manager_id] = item[selectedMetric];
      return acc;
    }, {});
  
    // Tarihleri sıralayın ve doğru şekilde formatlayın
    const labels = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
    const datasets = managers.map((manager) => ({
      label: manager.business_name,
      data: labels.map((date) => groupedData[date][manager.id] || 0),
      backgroundColor: manager.id === 1 ? 'rgba(75,192,192,0.4)' : manager.id === 2 ? 'rgba(255,99,132,0.4)' : 'rgba(54,162,235,0.4)', // Farklı renkler
      borderColor: manager.id === 1 ? 'rgba(75,192,192,1)' : manager.id === 2 ? 'rgba(255,99,132,1)' : 'rgba(54,162,235,1)',
      borderWidth: 1,
    }));
  
    console.log('Labels:', labels); // Ekleyin
    console.log('Datasets:', datasets); // Ekleyin
  
    return { labels, datasets };
  };
  
  const handleGenerateChart = () => {
    const { labels, datasets } = filterAndMapData();
    setChartData({
      labels,
      datasets,
    });
  };
  
  // Component render kısmı
  return (
    <div style={{ display: 'flex' }}>
      <Container style={{ marginLeft: '240px' }}>
        <Typography variant="h4" gutterBottom>
          Ciro Raporu
        </Typography>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Metrik Seçin</InputLabel>
          <Select value={selectedMetric} onChange={handleMetricChange} label="Metrik Seçin">
            <MenuItem value="pos_revenue">POS Ciro</MenuItem>
            <MenuItem value="ys_revenue">YemekSepeti Ciro</MenuItem>
            <MenuItem value="ys_online">YS Online</MenuItem>
            <MenuItem value="cash_start">Kasa Başlangıcı</MenuItem>
            <MenuItem value="cash_end">Kasa Sonu</MenuItem>
            <MenuItem value="pos1">POS1</MenuItem>
            <MenuItem value="pos2">POS2</MenuItem>
            <MenuItem value="pos3">POS3</MenuItem>
            <MenuItem value="ticket">Ticket</MenuItem>
            <MenuItem value="multinet">Multinet</MenuItem>
            <MenuItem value="sodexo">Sodexo</MenuItem>
            <MenuItem value="bank">Banka</MenuItem>
            <MenuItem value="expense">Harcama</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>İşletme Seçin</InputLabel>
          <Select value={selectedBusiness} onChange={handleBusinessChange} label="İşletme Seçin">
            {managers.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.business_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Başlangıç Tarihi"
          type="date"
          value={startDate}
          onChange={(e) => handleDateChange(e, 'start')}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Bitiş Tarihi"
          type="date"
          value={endDate}
          onChange={(e) => handleDateChange(e, 'end')}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleGenerateChart}>
          Filtrele
        </Button>
        {chartData && chartData.labels && chartData.labels.length > 0 && <Bar data={chartData} />}
      </Container>
    </div>
  );
};

export default CiroRapor;