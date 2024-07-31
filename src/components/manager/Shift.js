import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, Grid, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';

const convertTurkishChars = (str) => {
  const turkishMap = {
    'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'I': 'I', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U'
  };
  return str.replace(/[\u00C7\u00E7\u011F\u011E\u0130\u0131\u015E\u015F\u00D6\u00F6\u00DC\u00FC]/g, (match) => turkishMap[match]);
};

const Shift = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [shiftData, setShiftData] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });
  const [weekNumber, setWeekNumber] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const managerId = user.id;
        const response = await axios.get(`http://92.112.193.8:5018/get-employees?managerId=${managerId}`);
        setEmployeeList(response.data);
        setShiftData({
          monday: Array(response.data.length).fill(''),
          tuesday: Array(response.data.length).fill(''),
          wednesday: Array(response.data.length).fill(''),
          thursday: Array(response.data.length).fill(''),
          friday: Array(response.data.length).fill(''),
          saturday: Array(response.data.length).fill(''),
          sunday: Array(response.data.length).fill('')
        });
      } catch (error) {
        console.error('Çalışanlar alınırken hata oluştu:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleShiftChange = (day, index, event) => {
    const newShiftData = { ...shiftData };
    newShiftData[day][index] = event.target.value;
    setShiftData(newShiftData);
  };

  const formatAllShifts = (shiftData) => {
    const formattedShiftData = { ...shiftData };
    Object.keys(formattedShiftData).forEach(day => {
      if (Array.isArray(formattedShiftData[day])) {
        formattedShiftData[day] = formattedShiftData[day].map(shift => {
          return shift.replace(/(\d{1,2}):?(\d{0,2})-(\d{1,2}):?(\d{0,2})/, (match, startHour, startMin, endHour, endMin) => {
            startMin = startMin ? startMin.padEnd(2, '0') : '00';
            endMin = endMin ? endMin.padEnd(2, '0') : '00';
            return `${startHour.padStart(2, '0')}:${startMin}-${endHour.padStart(2, '0')}:${endMin}`;
          });
        });
      }
    });
    return formattedShiftData;
  };

  const saveShifts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const managerId = user.id;
      const formattedShiftData = formatAllShifts(shiftData);
      await axios.post('http://92.112.193.8:5018/save-shifts', {
        shiftData: formattedShiftData,
        managerId,
        week: weekNumber,
        employeeList
      });
      alert('Vardiyalar başarıyla kaydedildi');
    } catch (error) {
      console.error('Vardiyalar kaydedilirken hata oluştu:', error);
      alert('Vardiyalar kaydedilirken hata oluştu');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF('landscape');

    const tableColumn = ['Elemanlar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const tableRows = [];

    const formattedShiftData = formatAllShifts(shiftData);

    employeeList.forEach((employee, index) => {
      const employeeShift = [
        convertTurkishChars(`${employee.first_name} ${employee.last_name}`),
        formattedShiftData.monday[index] || '',
        formattedShiftData.tuesday[index] || '',
        formattedShiftData.wednesday[index] || '',
        formattedShiftData.thursday[index] || '',
        formattedShiftData.friday[index] || '',
        formattedShiftData.saturday[index] || '',
        formattedShiftData.sunday[index] || '',
      ];
      tableRows.push(employeeShift);
    });

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`SHIFT${dayjs().format('DDMMYYYY')}.pdf`);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Vardiya Ekle
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Haftayı Seçin</InputLabel>
        <Select
          value={weekNumber}
          onChange={(e) => setWeekNumber(e.target.value)}
          label="Haftayı Seçin"
        >
          {Array.from({ length: 52 }, (_, i) => (
            <MenuItem key={i} value={`${i + 1}. hafta, ${new Date().getFullYear()}`}>
              {`${i + 1}. hafta, ${new Date().getFullYear()}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ overflowX: 'auto' }}>
        <table id="shift-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Elemanlar</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Pazartesi</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Salı</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Çarşamba</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Perşembe</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Cuma</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Cumartesi</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Pazar</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.length > 0 ? (
              employeeList.map((employee, index) => (
                <tr key={employee.id}>
                                   <td style={{ border: '1px solid black', padding: '8px' }}>{employee.first_name + ' ' + employee.last_name}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <TextField
                      value={shiftData.monday[index] || ''}
                      onChange={(e) => handleShiftChange('monday', index, e)}
                      placeholder="12-21"
                      variant="outlined"
                      size="small"
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <TextField
                      value={shiftData.tuesday[index] || ''}
                      onChange={(e) => handleShiftChange('tuesday', index, e)}
                      placeholder="12-21"
                      variant="outlined"
                      size="small"
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <TextField
                      value={shiftData.wednesday[index] || ''}
                      onChange={(e) => handleShiftChange('wednesday', index, e)}
                      placeholder="12-21"
                      variant="outlined"
                      size="small"
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <TextField
                      value={shiftData.thursday[index] || ''}
                      onChange={(e) => handleShiftChange('thursday', index, e)}
                      placeholder="12-21"
                      variant="outlined"
                      size="small"
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <TextField
                      value={shiftData.friday[index] || ''}
                      onChange={(e) => handleShiftChange('friday', index, e)}
                      placeholder="12-21"
                      variant="outlined"
                      size="small"
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <TextField
                      value={shiftData.saturday[index] || ''}
                      onChange={(e) => handleShiftChange('saturday', index, e)}
                      placeholder="12-21"
                      variant="outlined"
                      size="small"
                    />
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <TextField
                      value={shiftData.sunday[index] || ''}
                      onChange={(e) => handleShiftChange('sunday', index, e)}
                      placeholder="12-21"
                      variant="outlined"
                      size="small"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ border: '1px solid black', padding: '8px' }}>Çalışan bulunamadı</td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={saveShifts}>
            Vardiyaları Kaydet
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={downloadPDF}>
            PDF Olarak İndir
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Shift;